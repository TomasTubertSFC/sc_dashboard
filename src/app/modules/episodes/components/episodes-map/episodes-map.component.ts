import { Component, ElementRef } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { Point } from 'chart.js';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { GeoJSONSourceComponent } from 'ngx-mapbox-gl';

@Component({
  selector: 'app-episodes-map',
  templateUrl: './episodes-map.component.html',
  styleUrl: './episodes-map.component.scss'
})
export class EpisodesMapComponent {

  public cone!: Cone;
  public points!: Point[];
  public observation: Point = { x: 0, y: 0};
  public selectedObservation: number | null = null;
  public previewObservation: number | null = null;
  public coneCanvas!: any;
  public imageLoaded: boolean = false;
  public studyZone: StudyZone | null = null;
  public episode: Episode| null = null;
  public previewEpisode: Episode| null = null;
  public APEGMOpoints: Point[] = [];
  public APEGMOpolygon: any[] = [];

  public canvasHeight: number = 1800;
  public canvasWidth: number = 1800;

  public context!: CanvasRenderingContext2D;

  public cones: {
    cone: Cone,
    canvas: HTMLCanvasElement,
    id: number,
  }[] = [];

  constructor(private studyZoneService: StudyZoneService) {}

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    this.studyZoneService.studyZone.subscribe(studyZone => {
      if (studyZone) {

        this.points = studyZone.APGEMO.flat();

        //separamos puntos y poligonos de APEGMO
        studyZone.APGEMO.forEach(point => {
          if (Array.isArray(point)) {
            let polygon:any = {
              geometry: {
                type: 'Polygon',
                coordinates: [point.map(pt => [pt.x, pt.y])]
              }
            };
            this.APEGMOpolygon.push(polygon);

          }
          else {
            this.APEGMOpoints.push(point);
          }
        });
        console.log(this.APEGMOpolygon);

        //obtener media de las coordenadas
        let averageX = 0;
        let averageY = 0;
        this.points.map(point => {
          averageX += point.x/this.points.length;
          averageY += point.y/this.points.length;
        });
        this.observation = { x: averageX, y: averageY };

      }
    });

    this.studyZoneService.previewEpisode.subscribe(episode => {
      if (episode) {
        this.previewEpisode = episode;
      }
      else {
        this.previewEpisode = null;
      }
    });

    this.studyZoneService.observation.subscribe(observation => {
      this.selectedObservation = observation;
      this.leaveObservation();
    });
    this.studyZoneService.previewObservation.subscribe(previewObservation => {
      this.previewObservation = previewObservation;
      this.overObservation(this.previewObservation);
      if(previewObservation === null){
        this.leaveObservation();
      }
    });

    this.studyZoneService.episode.subscribe(episode => {

      this.cones.map(cone => {
        cone.canvas.remove();
        return;
      })
      this.cones = [];

      if (episode) {

        // coordenadas promedio de las observaciones
        let averageX = 0;
        let averageY = 0;
        episode.observations.forEach(observation => {
          averageX += observation.longitude / episode.observations.length;
          averageY += observation.latitude / episode.observations.length;
        });

        this.observation = { x: averageX, y: averageY };

        this.episode = episode;

        episode.observations.forEach(observation => {
          //create canvas for each observation

          let canvas:HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
          let id:number = observation.id;
          let points = [...this.points];

          canvas.width = this.canvasWidth;
          canvas.height = this.canvasHeight;
          canvas.id = `cone-${id}`;
          canvas.style.display = 'none';

          document.body.appendChild(canvas);

          this.coneCanvas = canvas;
          this.context = new ElementRef(canvas).nativeElement.getContext('2d') as CanvasRenderingContext2D;
          this.cone = new Cone(points, {x: observation.longitude, y: observation.latitude, id: observation.id}, true, this.canvasHeight, this.canvasWidth);
          let cone = this.cone;

          this.cones.push({cone, canvas, id});

          if(this.cone.observationCone && this.cone.observationCone.angle){
            this.drawCone(undefined, undefined, 0.10);
          }

        });
      }
    });
  }

  private hexToRGBA(hex:string, alpha:number = 1) {
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private calculateAngle(p1:Point, vertex:Point, p2:Point) {
    if (p1.x === p2.x && p1.y === p2.y) {
        return 0;
    }
    const dx1 = p1.x - vertex.x;
    const dy1 = p1.y - vertex.y;
    const dx2 = p2.x - vertex.x;
    const dy2 = p2.y - vertex.y;

    const dotProduct = dx1 * dx2 + dy1 * dy2;
    const crossProduct = dx1 * dy2 - dy1 * dx2;

    let angleInRadians = Math.acos(dotProduct / (Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2)));

    // Si el producto cruzado es negativo, el ángulo está en el sentido de las agujas del reloj
    if (crossProduct < 0) {
        angleInRadians = 2 * Math.PI - angleInRadians;
    }

    return angleInRadians * (180 / Math.PI);  // Convertir a grados
  }

  private drawCone(adjacentColor:string = '#14b8a6', observationColor:string = '#c93d82', alpha:number = 0.2) {
    if(this.cone.observationCone?.vertexPosition){
    // Dibujar el arco del angulo de observacion abarcando todos los puntos
    const initialAnglePoint = this.calculateAngle({ x: this.cone.observationCone.vertexPosition.x + 1000, y: this.cone.observationCone.vertexPosition.y }, this.cone.observationCone.vertexPosition, this.cone.observationCone.initialSidePosition) * (Math.PI / 180);
    const finalAnglePoint = this.calculateAngle({ x: this.cone.observationCone.vertexPosition.x + 1000, y: this.cone.observationCone.vertexPosition.y }, this.cone.observationCone.vertexPosition, this.cone.observationCone.terminalSidePosition) * (Math.PI / 180);

    this.context.strokeStyle = this.hexToRGBA(observationColor, alpha * 2);
    this.context.lineWidth = 1;
    this.context.fillStyle = this.hexToRGBA(observationColor, alpha);
    this.context.beginPath();
    this.context.arc(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y, this.cone.coneSize, initialAnglePoint, finalAnglePoint, false);
    this.context.lineTo(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();

    // Dibujar 30º de angulo desde el punto previo
    this.context.strokeStyle = this.hexToRGBA(adjacentColor, alpha * 2);
    this.context.lineWidth = 1;
    this.context.fillStyle = this.hexToRGBA(adjacentColor, alpha);
    this.context.beginPath();
    this.context.arc(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y, this.cone.coneSize, initialAnglePoint, initialAnglePoint + (- this.cone.initialAdjacentAngle.angle * (Math.PI / 180)), true);
    this.context.lineTo(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();

    // Dibujar ángulo adyacente final
    this.context.beginPath();
    this.context.arc(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y, this.cone.coneSize, finalAnglePoint, finalAnglePoint + (this.cone.terminalAdjacentAngle.angle * (Math.PI / 180)), false);
    this.context.lineTo(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
    }
    else{
      //this.drawConvexHull();
    }
  }

  private drawConvexHull() {


    let minX:number = 0, maxX:number = 0, minY:number = 0, maxY:number = 0;

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
    const scale = Math.min(this.canvasWidth / mapWidth, this.canvasHeight / mapHeight);


    this.context.strokeStyle = this.hexToRGBA('#14b8a6', 0.5);
    this.context.beginPath();
    this.cone.convexHull.forEach(p => {
      this.context.lineTo(
        ((p.x - mapCenterX ) * scale + this.canvasWidth / 2) - minX,
        ((p.y - mapCenterY ) * scale + this.canvasHeight / 2) - minY
      );
    });
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = this.hexToRGBA('#14b8a6', 0.2);
    this.context.fill();
    this.context.beginPath();
  }

  public observationSelected(event:Event, id:number | null = null):void {
    if(id !== null && this.studyZoneService.observation.value !== id){
      this.studyZoneService.observation = id;
    }
    else {
      this.studyZoneService.observation = null;
    }
  }

  public overObservation(id:number | null = null):void {
    if(id !== null){
      if(this.studyZoneService.previewObservation.value !== id) this.studyZoneService.previewObservation = id;
      this.cones.forEach(cone => {
        this.cone = cone.cone;
        this.coneCanvas = cone.canvas;
        this.context = cone.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if(cone.id === id){
          this.drawCone(undefined, undefined, 0.5);
        }
      });
    }
  }

  public leaveObservation():void {
    if(this.studyZoneService.previewObservation.value !== null) this.studyZoneService.previewObservation = null;
    this.cones.forEach(cone => {
      this.cone = cone.cone;
      this.coneCanvas = cone.canvas;
      this.context = cone.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if(cone.id === this.studyZoneService.observation.value){
        this.drawCone(undefined, undefined, 0.5);
      }
      else {
        this.drawCone(undefined, undefined, 0.10);
      }
    });
  }

}
