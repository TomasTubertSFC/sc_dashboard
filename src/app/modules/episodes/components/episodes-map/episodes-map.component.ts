import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Cone } from '../../../../models/cone';
import { Point } from 'chart.js';
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

  public cone!: Cone;
  public points!: Point[];
  public observation: Point = { x: 0, y: 0 };
  public selectedObservation: number | null = null;
  public previewObservation: number | null = null;
  public coneCanvas!: any;
  public imageLoaded: boolean = false;
  public studyZone: StudyZone | null = null;
  public episode: Episode | null = null;
  public previewEpisode: Episode | null = null;
  public APGEMOpoints: Point[] = [];
  public APGEMOpolygon: Polygon[] = [];
  public APGEMOpolygonStyle: {} = {
    'fill-outline-color': '#363c69',
    'fill-color': '#348ac7',
    'fill-opacity': 0.8,
  };

  public canvasHeight: number = 2100;
  public canvasWidth: number = 2100;

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
            let polygon: Polygon = { geometry: { type: 'Polygon', coordinates: [point.map((pt) => [pt.x, pt.y])] }};
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
          averageX += point.x / this.points.length;
          averageY += point.y / this.points.length;
        });
        this.observation = { x: averageX, y: averageY };
      }

      setTimeout(() => {
        if (this.points) {
          const bbox = this.getBboxFromPoints();
          this.map?.mapInstance.fitBounds(bbox, { padding: { top: 50, bottom: 200, left: 50, right: 500 } });
        }
      });
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe(
      (state) => {
        setTimeout(() => {
          if (this.map?.mapInstance) this.map.mapInstance.resize();
        }, 250);
      }
    );

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

    this.observation$ = this.studyZoneService.observation.subscribe(
      (observation) => {
        this.selectedObservation = observation;
        this.leaveObservation();
      }
    );

    this.previewObservation$ = this.studyZoneService.previewObservation.subscribe(
      (previewObservation) => {
        this.previewObservation = previewObservation;
        this.overObservation(this.previewObservation);
        if (previewObservation === null) {
          this.leaveObservation();
        }
      }
    );

    this.episode$ = this.studyZoneService.episode.subscribe((episode) => {
      this.cones.map((cone) => {
        cone.canvas.remove();
        return;
      });
      this.cones = [];

      if (episode) {
        // coordenadas promedio de las observaciones
        let averageX = 0;
        let averageY = 0;
        episode.observations.forEach((observation) => {
          averageX += observation.longitude / episode.observations.length;
          averageY += observation.latitude / episode.observations.length;
        });

        this.observation = { x: averageX, y: averageY };

        this.episode = episode;

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

            document.body.appendChild(canvas);

            this.coneCanvas = canvas;
            this.context = new ElementRef(canvas).nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.cone = new Cone( points, { x: observation.longitude, y: observation.latitude, id: observation.id }, true, this.canvasHeight, this.canvasWidth, observation.relationships.wind );
            let cone = this.cone;

            if (this.cone.plausibleCone)
              observation.plausible = true;

            this.cones.push({ cone, canvas, id });

            if (this.cone.observationCone && this.cone.observationCone.angle)
              this.drawCone(undefined, undefined, 0.1);
          }
        });
      }

      setTimeout(() => {
        const bbox = this.getBboxFromPointsAndObservations();
        if (this.map?.mapInstance)
          this.map.mapInstance.fitBounds(bbox, {
            padding: { top: 50, bottom: 200, left: 50, right: 500 },
          });
      });
    });
  }
  private hexToRGBA(hex: string, alpha: number = 1) {
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private calculateAngle(p1: Point, vertex: Point, p2: Point) {
    if (p1.x === p2.x && p1.y === p2.y) {
      return 0;
    }
    const dx1 = p1.x - vertex.x;
    const dy1 = p1.y - vertex.y;
    const dx2 = p2.x - vertex.x;
    const dy2 = p2.y - vertex.y;

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

  private drawCone(
    adjacentColor: string = '#14b8a6',
    observationColor: string = '#c93d82',
    alpha: number = 0.2
  ) {
    //pasamos grados de viento a grados de dibujo en canvas
    if (this.cone.wind.deg <= 90) {
      var windDegrees = this.cone.wind.deg + 270;
    } else {
      var windDegrees = this.cone.wind.deg - 90;
    }

    if (this.cone.observationCone?.vertexPosition) {
      // Dibujar el arco del angulo de observacion abarcando todos los puntos
      const initialAnglePoint =
        this.calculateAngle(
          {
            x: this.cone.observationCone.vertexPosition.x + 1000,
            y: this.cone.observationCone.vertexPosition.y,
          },
          this.cone.observationCone.vertexPosition,
          this.cone.observationCone.initialSidePosition
        ) *
        (Math.PI / 180);
      const finalAnglePoint =
        this.calculateAngle(
          {
            x: this.cone.observationCone.vertexPosition.x + 1000,
            y: this.cone.observationCone.vertexPosition.y,
          },
          this.cone.observationCone.vertexPosition,
          this.cone.observationCone.terminalSidePosition
        ) *
        (Math.PI / 180);

      this.context.strokeStyle = this.hexToRGBA(observationColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.fillStyle = this.hexToRGBA(observationColor, alpha);
      this.context.beginPath();
      this.context.arc(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y,
        this.cone.coneSize,
        initialAnglePoint,
        finalAnglePoint,
        false
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y
      );
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar 30º de angulo desde el punto previo
      this.context.strokeStyle = this.hexToRGBA(adjacentColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.fillStyle = this.hexToRGBA(adjacentColor, alpha);
      this.context.beginPath();
      this.context.arc(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y,
        this.cone.coneSize,
        initialAnglePoint,
        initialAnglePoint +
          -this.cone.initialAdjacentAngle.angle * (Math.PI / 180),
        true
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y
      );
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar ángulo adyacente final
      this.context.beginPath();
      this.context.arc(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y,
        this.cone.coneSize,
        finalAnglePoint,
        finalAnglePoint +
          this.cone.terminalAdjacentAngle.angle * (Math.PI / 180),
        false
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x,
        this.cone.observationCone.vertexPosition.y
      );
      this.context.closePath();
      this.context.stroke();
      this.context.fill();

      // Dibujar dirección del viento

      let initialDistanceArrow = this.canvasHeight / 5;
      let finalDistanceArrow = this.canvasHeight / 2.2;
      let initialTriangleArrow = initialDistanceArrow - 30;
      let finalTriangleArrow = initialTriangleArrow + 35;

      let windColor = this.cone.plausibleCone ? '#FFF' : '#e96c63';
      let windStrokeColor = this.cone.plausibleCone ? '#DDD' : '#64110b';
      this.context.strokeStyle = this.hexToRGBA(windStrokeColor, alpha * 2);
      this.context.fillStyle = this.hexToRGBA(windColor, alpha * 2);
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.moveTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos((windDegrees - 5) * (Math.PI / 180)) * finalTriangleArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin((windDegrees - 5) * (Math.PI / 180)) * finalTriangleArrow
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos(windDegrees * (Math.PI / 180)) * initialTriangleArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin(windDegrees * (Math.PI / 180)) * initialTriangleArrow
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos((windDegrees + 5) * (Math.PI / 180)) * finalTriangleArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin((windDegrees + 5) * (Math.PI / 180)) * finalTriangleArrow
      );

      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos((windDegrees + 2) * (Math.PI / 180)) * initialDistanceArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin((windDegrees + 2) * (Math.PI / 180)) * initialDistanceArrow
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos(windDegrees * (Math.PI / 180)) * finalDistanceArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin(windDegrees * (Math.PI / 180)) * finalDistanceArrow
      );
      this.context.lineTo(
        this.cone.observationCone.vertexPosition.x +
          Math.cos((windDegrees - 2) * (Math.PI / 180)) * initialDistanceArrow,
        this.cone.observationCone.vertexPosition.y +
          Math.sin((windDegrees - 2) * (Math.PI / 180)) * initialDistanceArrow
      );
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    } else {
      //this.drawConvexHull();
    }

    let layerId = 'APEGMOpolygons';
    if (this.map?.mapInstance && this.map.mapInstance.getLayer(layerId)) {
      setTimeout(() => {
        this.map?.mapInstance.moveLayer(layerId);
      });
    }

  }

  private getBboxFromPointsAndObservations(): [
    [number, number],
    [number, number]
  ] {
    let points = this.points;
    let observations =
      this.episode?.observations.map((observation) => ({
        x: observation.longitude,
        y: observation.latitude,
      })) || [];

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.x;
        minY = maxY = p.y;
      } else {
        minX = Math.min(p.x, minX);
        minY = Math.min(p.y, minY);
        maxX = Math.max(p.x, maxX);
        maxY = Math.max(p.y, maxY);
      }
    });

    observations.forEach((p) => {
        minX = Math.min(p.x, minX);
        minY = Math.min(p.y, minY);
        maxX = Math.max(p.x, maxX);
        maxY = Math.max(p.y, maxY);
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  private getBboxFromPoints(): [[number, number], [number, number]] {
    let points = this.points;

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.x;
        minY = maxY = p.y;
      } else {
        minX = Math.min(p.x, minX);
        minY = Math.min(p.y, minY);
        maxX = Math.max(p.x, maxX);
        maxY = Math.max(p.y, maxY);
      }
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  private drawConvexHull() {
    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    this.cone.convexHull.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.x;
        minY = maxY = p.y;
      } else {
        minX = Math.min(p.x, minX);
        minY = Math.min(p.y, minY);
        maxX = Math.max(p.x, maxX);
        maxY = Math.max(p.y, maxY);
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
        (p.x - mapCenterX) * scale + this.canvasWidth / 2 - minX,
        (p.y - mapCenterY) * scale + this.canvasHeight / 2 - minY
      );
    });
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = this.hexToRGBA('#14b8a6', 0.2);
    this.context.fill();
    this.context.beginPath();
  }

  public observationSelected(event: Event, id: number | null = null): void {
    if (id !== null && this.studyZoneService.observation.value !== id) {
      this.studyZoneService.observation = id;
    } else {
      this.studyZoneService.observation = null;
    }
  }

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
