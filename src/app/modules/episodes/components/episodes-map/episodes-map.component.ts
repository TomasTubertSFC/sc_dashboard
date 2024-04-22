import { Point } from './../../../../models/cone';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { MapComponent } from 'ngx-mapbox-gl';
import { MenuService } from '../../../../layout/components/menu/app.menu.service';
import { Subscription } from 'rxjs';
import { Polygon } from '../../../../models/polygon';

@Component({
  selector: 'app-episodes-map',
  templateUrl: './episodes-map.component.html',
  styleUrl: './episodes-map.component.scss',
})
export class EpisodesMapComponent implements OnDestroy, AfterViewInit {

  @ViewChild('map') map!: MapComponent | null;
  @Input('episodesSidebarVisible') episodesSidebarVisible: boolean = false;

  public cone!: Cone;
  public points!: Point[];
  public observation: Point = { longitude: 0, latitude: 0 };
  public selectedObservation: number | null = null;
  public previewObservation: number | null = null;
  public coneCanvas!: any;
  public imageLoaded: boolean = false;
  public studyZone: StudyZone | null = null;
  public episode: Episode | null = null;
  public previewEpisode: Episode | null = null;
  public APGEMOpoints: Point[] = [];
  public APGEMOpolygon: Polygon[] = [];

  //estilo de los poligonos de APEGMO
  public APGEMOpolygonStyle: {} = {
    'fill-outline-color': '#8ad1f9',
    'fill-color': '#8ad1f9',
    'fill-opacity': 0.8,
  };

  //resolución del canvas de los conos
  public canvasHeight: number = 1000;
  public canvasWidth: number = 1000;

  public context!: CanvasRenderingContext2D;

  public cones: {
    cone: Cone;
    canvas: HTMLCanvasElement;
    id: number;
  }[] = [];

  private sidebarMenuIsOpen$!: Subscription;
  private studyZone$!: Subscription;
  private episode$!: Subscription;
  private previewEpisode$!: Subscription;
  private observation$!: Subscription;
  private previewObservation$!: Subscription;

  /*
    * @method constructor
    * @description Método constructor del componente.
    * Se inyectan los servicios de la zona de estudio y del menú lateral.
    * Se suscribe al observable de la zona de estudio.
    * Se calcula la media de las coordenadas de la zona de estudio con la finalidad de centrar el mapa en la vista.
    * @param studyZoneService Servicio de la zona de estudio.
    * @param menuService Servicio del menú lateral.
  */
  constructor(
    private studyZoneService: StudyZoneService,
    private menuService: MenuService,
  ) {
    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (studyZone) {
        this.points = studyZone.APGEMO.flat();

        //separamos puntos y poligonos de APEGMO
        studyZone.APGEMO.forEach((point) => {
          if (Array.isArray(point)) {
            let polygon: Polygon = { geometry: { type: 'Polygon', coordinates: [point.map((pt) => [pt.longitude, pt.latitude])] }};
            this.APGEMOpolygon.push(polygon);
          }
          else {
            this.APGEMOpoints.push(point);
          }
        });

        //obtener media de las coordenadas
        let averageX = 0;
        let averageY = 0;
        this.points.map((point) => {
          averageX += point.longitude / this.points.length;
          averageY += point.latitude / this.points.length;
        });
        this.observation = { longitude: averageX, latitude: averageY };
      }

      //una vez dibujada la vista, ajustar el zoom para que se vea toda la zona de estudio
      setTimeout(() => {
        if (this.points) {
          console.log(this.points)
          const bbox = this.getBboxFromPoints();
          this.map?.mapInstance.fitBounds(bbox, { padding: { top: 50, bottom: 200, left: 50, right: this.episodesSidebarVisible? 500 : 50 } });
        }
      });
    });
  }

  /*
    * @method ngAfterViewInit
    * @description Método que se ejecuta después de que la vista del componente se haya inicializado.
    * Se suscribe a los observables de los servicios de la zona de estudio y del menú lateral.
  */
  ngAfterViewInit(): void {
    this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe(
      (state) => {
        setTimeout(() => {
          if (this.map?.mapInstance) this.map.mapInstance.resize();
        }, 250);
      }
    );

    //observar cambios en la observacion seleccionada para resaltarla, puede ser modificado desde el modal o el timeline
    this.observation$ = this.studyZoneService.observation.subscribe(
      (observation) => {
        this.selectedObservation = observation;
        this.leaveObservation();
      }
    );

    //observar cambios en la vista prevía de la observación para resaltarla, puede ser modificado desde el modal o el timeline haciendo hover
    this.previewObservation$ = this.studyZoneService.previewObservation.subscribe(
      (previewObservation) => {
        this.previewObservation = previewObservation;
        this.overObservation(this.previewObservation);
        if (previewObservation === null) {
          this.leaveObservation();
        }
      }
    );

    //observar cambios en el hover de los episodios este previewEpisode puede ser modificado desde el modal o el timeline
    this.episode$ = this.studyZoneService.previewEpisode.subscribe(
      (episode) => {
        if (episode) {
          this.previewEpisode = episode;
        } else {
          this.previewEpisode = null;
        }
        let layerId = 'APEGMOpolygons';
        if (this.map?.mapInstance && this.map.mapInstance.getLayer(layerId)) {
          setTimeout(() => {
            this.map?.mapInstance.moveLayer(layerId);
          });
        }
      }
    );

    //observar cambios en el episodio seleccionado para mostrarlo en el mapa, puede ser modificado desde el modal o el timeline
    this.episode$ = this.studyZoneService.episode.subscribe((episode) => {

      //limpiar canvas de conos
      this.cones.map((cone) => {
        cone.canvas.remove();
        return;
      });
      this.cones = [];


      if (episode) {

        this.episode = episode;

        // coordenadas promedio de las observaciones
        let averageX = 0;
        let averageY = 0;
        this.episode.observations.forEach((observation) => {
          averageX += observation.longitude / episode.observations.length;
          averageY += observation.latitude / episode.observations.length;
        });

        this.observation = { longitude: averageX, latitude: averageY };

        episode.observations.forEach((observation) => {
          //crear canvas para cada cono si la observacion no es plausible
          if ( observation.APGEMOdistance > this.studyZoneService.plausibilityDistance && observation.relationships.wind.speed > this.studyZoneService.plausibilityWindSpeed) {

            let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
            let id: number = observation.id;
            let points = [...this.points];

            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            canvas.id = `cone-${id}`;
            canvas.style.display = 'none';

            //añadir canvas al DOM
            document.body.appendChild(canvas);

            //crear cono
            this.coneCanvas = canvas;
            this.context = new ElementRef(canvas).nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.cone = new Cone( points, { longitude: observation.longitude, latitude: observation.latitude, id: observation.id }, true, this.canvasHeight, this.canvasWidth, observation.relationships.wind );
            let cone = this.cone;

            //Si el cálculo del cono indica que la observación es plausible, marcar observación y episodio como plausible
            if (this.cone.plausibleCone){
              observation.plausible = true;
              episode.plausible = true;
            }

            //añadir cono al array de conos
            this.cones.push({ cone, canvas, id });

            //dibujar cono
            if (this.cone.observationCone && this.cone.observationCone.angle)
              this.drawCone(undefined, undefined, 0.1);
          }
        });
      }

      setTimeout(() => {
        const bbox = this.getBboxFromPointsAndObservations();
        if (this.map?.mapInstance)
          this.map.mapInstance.fitBounds(bbox, {
            padding: { top: 50, bottom: 200, left: 50, right: this.episodesSidebarVisible? 500 : 50  },
          });
      });
    });
  }

  /*
    * @method hexToRGBA
    * @description Método que convierte un color en formato hexadecimal a RGBA.
    * @param hex Color en formato hexadecimal.
    * @param alpha Opacidad del color.
    * @returns string
  */
  private hexToRGBA(hex: string, alpha: number = 1) {
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /*
    * @method calculateAngle
    * @description Método que calcula el ángulo entre dos puntos y un vértice.
    * @param p1 Primer punto.
    * @param vertex Vértice.
    * @param p2 Segundo punto.
    * @returns number
  */
  private calculateAngle(p1: Point, vertex: Point, p2: Point) {
    if (p1.longitude === p2.longitude && p1.latitude === p2.latitude) {
      return 0;
    }
    const dx1 = p1.longitude - vertex.longitude;
    const dy1 = p1.latitude - vertex.latitude;
    const dx2 = p2.longitude - vertex.longitude;
    const dy2 = p2.latitude - vertex.latitude;

    const dotProduct = dx1 * dx2 + dy1 * dy2;
    const crossProduct = dx1 * dy2 - dy1 * dx2;

    let angleInRadians = Math.acos(
      dotProduct /
        (Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2))
    );

    // Si el producto cruzado es negativo, el ángulo está en el sentido de las agujas del reloj
    if (crossProduct < 0) {
      angleInRadians = 2 * Math.PI - angleInRadians;
    }

    return angleInRadians * (180 / Math.PI); // Convertir a grados
  }

  /*
    * @method drawCone
    * @description Método que se encarga de dibujar el cono de observación en el canvas.
    * @param adjacentColor Color de los conos adyacentes (30º al inicio y al final).
    * @param observationColor Color del cono de observación principal.
    * @param alpha Opacidad del cono.
    * @returns void
  */
  private drawCone(adjacentColor: string = '#b5cf6e', observationColor: string = '#ff6200', alpha: number = 0.2) {
    //pasamos grados de viento a grados de dibujo en canvas
    if (this.cone.wind.deg <= 90) {
      var windDegrees = this.cone.wind.deg + 270;
    } else {
      var windDegrees = this.cone.wind.deg - 90;
    }

    //si la observación está fuera del perímetro de la zona de estudio, dibujar el cono de observación
    if (this.cone.observationCone?.vertexPosition) {
      // Dibujar el arco del angulo de observacion abarcando todos los puntos
      const initialAnglePoint = this.calculateAngle({ longitude: this.cone.observationCone.vertexPosition.longitude + 1000, latitude: this.cone.observationCone.vertexPosition.latitude }, this.cone.observationCone.vertexPosition, this.cone.observationCone.initialSidePosition) * (Math.PI / 180);
      const finalAnglePoint = this.calculateAngle({longitude: this.cone.observationCone.vertexPosition.longitude + 1000, latitude: this.cone.observationCone.vertexPosition.latitude}, this.cone.observationCone.vertexPosition, this.cone.observationCone.terminalSidePosition) * (Math.PI / 180);

      this.context.strokeStyle = this.hexToRGBA(observationColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.fillStyle = this.hexToRGBA(observationColor, alpha);
      this.context.beginPath();
      this.context.arc(this.cone.observationCone.vertexPosition.longitude, this.cone.observationCone.vertexPosition.latitude, this.cone.coneSize, initialAnglePoint, finalAnglePoint, false);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude, this.cone.observationCone.vertexPosition.latitude);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar 30º de angulo desde el punto previo
      this.context.strokeStyle = this.hexToRGBA(adjacentColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.fillStyle = this.hexToRGBA(adjacentColor, alpha);
      this.context.beginPath();
      this.context.arc(this.cone.observationCone.vertexPosition.longitude, this.cone.observationCone.vertexPosition.latitude, this.cone.coneSize, initialAnglePoint, initialAnglePoint + -this.cone.initialAdjacentAngle.angle * (Math.PI / 180), true );
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude,this.cone.observationCone.vertexPosition.latitude);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar ángulo adyacente final
      this.context.beginPath();
      this.context.arc(this.cone.observationCone.vertexPosition.longitude, this.cone.observationCone.vertexPosition.latitude, this.cone.coneSize, finalAnglePoint, finalAnglePoint + this.cone.terminalAdjacentAngle.angle * (Math.PI / 180), false);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude, this.cone.observationCone.vertexPosition.latitude);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar dirección del viento

      let initialDistanceArrow = this.canvasHeight / 5;
      let finalDistanceArrow = this.canvasHeight / 2.2;
      let initialTriangleArrow = initialDistanceArrow - 30;
      let finalTriangleArrow = initialTriangleArrow + 35;

      let windColor = this.cone.plausibleCone ? '#FFF' : observationColor;
      let windStrokeColor = this.cone.plausibleCone ? '#FFF' : observationColor;
      this.context.strokeStyle = this.hexToRGBA(windStrokeColor, alpha * 2);
      this.context.fillStyle = this.hexToRGBA(windColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.moveTo(this.cone.observationCone.vertexPosition.longitude + Math.cos((windDegrees - 5) * (Math.PI / 180)) * finalTriangleArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin((windDegrees - 5) * (Math.PI / 180)) * finalTriangleArrow);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude + Math.cos(windDegrees * (Math.PI / 180)) * initialTriangleArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin(windDegrees * (Math.PI / 180)) * initialTriangleArrow);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude + Math.cos((windDegrees + 5) * (Math.PI / 180)) * finalTriangleArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin((windDegrees + 5) * (Math.PI / 180)) * finalTriangleArrow);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude + Math.cos((windDegrees + 2) * (Math.PI / 180)) * initialDistanceArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin((windDegrees + 2) * (Math.PI / 180)) * initialDistanceArrow);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude + Math.cos(windDegrees * (Math.PI / 180)) * finalDistanceArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin(windDegrees * (Math.PI / 180)) * finalDistanceArrow);
      this.context.lineTo(this.cone.observationCone.vertexPosition.longitude + Math.cos((windDegrees - 2) * (Math.PI / 180)) * initialDistanceArrow, this.cone.observationCone.vertexPosition.latitude + Math.sin((windDegrees - 2) * (Math.PI / 180)) * initialDistanceArrow);
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }
    //si la observación está dentro del perímetro de la zona de estudio, dibujar perímetro de la zona de estudio
    else {
      //this.drawConvexHull();
    }

    //una vez dibujado el cono, ponemos el polígono de APEGMO por encima
    let layerId = 'APEGMOpolygons';
    if (this.map?.mapInstance && this.map.mapInstance.getLayer(layerId)) {
      setTimeout(() => {
        this.map?.mapInstance.moveLayer(layerId);
      });
    }

  }

  /*
    * @method getBboxFromPointsAndObservations
    * @description Método que obtiene las coordenadas de la caja delimitadora de los puntos (APGEMOS) y observaciones.
    * @returns [[number, number], [number, number]]
  */
  private getBboxFromPointsAndObservations(): [[number, number], [number, number]] {
    let points = this.points;
    let observations =
      this.episode?.observations.map((observation) => ({
        longitude: observation.longitude,
        latitude: observation.latitude,
      })) || [];

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.longitude;
        minY = maxY = p.latitude;
      } else {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
      }
    });

    observations.forEach((p) => {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  /*
    * @method getBboxFromPoints
    * @description Método que obtiene las coordenadas de la caja delimitadora de los puntos (APGEMOS).
    * @returns [[number, number], [number, number]]
  */

  private getBboxFromPoints(): [[number, number], [number, number]] {
    let points = this.points;

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.longitude;
        minY = maxY = p.latitude;
      } else {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
      }
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  /*
    * @method drawConvexHull
    * @description Método que se encarga de dibujar el perímetro de la zona de estudio.
    * @returns void
  */
  private drawConvexHull() {
    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    this.cone.convexHull.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.longitude;
        minY = maxY = p.latitude;
      } else {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
      }
    });

    const mapWidth = maxX - minX;
    const mapHeight = maxY - minY;
    const mapCenterX = (maxX + minX) / 2;
    const mapCenterY = (maxY + minY) / 2;

    this.coneCanvas.height = maxY - minY;
    this.coneCanvas.width = maxX - minX;
    const scale = Math.min(
      this.canvasWidth / mapWidth,
      this.canvasHeight / mapHeight
    );

    this.context.strokeStyle = this.hexToRGBA('#14b8a6', 0.5);
    this.context.beginPath();
    this.cone.convexHull.forEach((p) => {
      this.context.lineTo(
        (p.longitude - mapCenterX) * scale + this.canvasWidth / 2 - minX,
        (p.latitude - mapCenterY) * scale + this.canvasHeight / 2 - minY
      );
    });
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = this.hexToRGBA('#14b8a6', 0.2);
    this.context.fill();
    this.context.beginPath();
  }

  /*
    * @method observationSelected
    * @description Método que se encarga de marcar como seleccionada una observación.
    * @param event Evento de selección.
    * @param id Identificador de la observación.
    * @returns void
  */
  public observationSelected(event: Event, id: number | null = null): void {
    if (id !== null && this.studyZoneService.observation.value !== id) {
      this.studyZoneService.observation = id;
    } else {
      this.studyZoneService.observation = null;
    }
  }

  /*
    * @method overObservation
    * @description Cuando se hace hover sobre una observación, se resalta en el mapa mostrando el cono de observación y marca la observación como vista previa.
    * @param id Identificador de la observación.
    * @returns void
  */
  public overObservation(id: number | null = null): void {
    if (id !== null) {

      if (this.studyZoneService.previewObservation.value !== id)
        this.studyZoneService.previewObservation = id;

      this.cones.forEach((cone) => {
        this.cone = cone.cone;
        this.coneCanvas = cone.canvas;
        this.context = cone.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (cone.id === id) {
          this.drawCone(undefined, undefined, 0.5);
        }
      });

    }
  }

  /*
    * @method leaveObservation
    * @description Método que se encarga de limpiar el cono de observación cuando se deja de hacer hover sobre una observación y se elimina la vista previa.
    * @returns void
  */
  public leaveObservation(): void {
    if (this.studyZoneService.previewObservation.value !== null)
      this.studyZoneService.previewObservation = null;
    this.cones.forEach((cone) => {
      this.cone = cone.cone;
      this.coneCanvas = cone.canvas;
      this.context = cone.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (cone.id === this.studyZoneService.observation.value) {
        this.drawCone(undefined, undefined, 0.5);
      } else {
        this.drawCone(undefined, undefined, 0.1);
      }
    });
  }

  /*
    * @method ngOnDestroy
    * @description Método que se ejecuta al destruir el componente.
    * Se eliminan los conos del canvas y se desuscriben los observables.
    * Se desmarcan el episodio y observación como seleccionados y de vista previa.
    * @returns void
  */
  ngOnDestroy() {
    this.cones.map((cone) => {
      cone.canvas.remove();
      return;
    });
    this.sidebarMenuIsOpen$?.unsubscribe();
    this.studyZone$?.unsubscribe();
    this.previewEpisode$?.unsubscribe();
    this.observation$?.unsubscribe();
    this.previewObservation$?.unsubscribe();
    this.episode$?.unsubscribe();

    this.map = null;
    this.studyZoneService.observation = null;
    this.studyZoneService.previewObservation = null;
    this.studyZoneService.episode = null;
    this.studyZoneService.previewEpisode = null;
  }
}
