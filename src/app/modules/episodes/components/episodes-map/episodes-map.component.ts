import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { HttpClient } from '@angular/common/http';
import { Point } from 'chart.js';
import { EpisodeService } from '../../../../services/episode.service';

@Component({
  selector: 'app-episodes-map',
  templateUrl: './episodes-map.component.html',
  styleUrl: './episodes-map.component.scss'
})
export class EpisodesMapComponent {
  public cone!: Cone;
  public points!: Point[];
  public observation: Point = { x: 0, y: 0};
  public coneCanvas!: any;
  public imageLoaded: boolean = false;

  public canvasHeight: number = 1200;
  public canvasWidth: number = 1200;

  @ViewChild('canvasCone') canvas!: ElementRef<HTMLCanvasElement>;
  public context!: CanvasRenderingContext2D;

  constructor(
    private episodeService: EpisodeService
    ) {}

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.episodeService.episode.subscribe(episode => {
      if (episode) {
        this.points = episode.APGEMO.map(point => {
          return { x: point.x, y: point.y };
        });
        this.observation = { x: episode.observations[2].x, y: episode.observations[2].y };
        episode.observations.forEach(observation => {

          this.cone = new Cone(this.points, observation, true, this.canvasHeight, this.canvasWidth);
          if(this.cone.observationCone && this.cone.observationCone.angle){
            this.drawCone();
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

  private drawCone(adjacentColor:string = '#14b8a6', observationColor:string = '#c93d82', pointSize:number|null = null) {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // Dibujar el arco del angulo de observacion abarcando todos los puntos
    const initialAnglePoint = this.calculateAngle({ x: this.cone.observationCone.vertexPosition.x + 1000, y: this.cone.observationCone.vertexPosition.y }, this.cone.observationCone.vertexPosition, this.cone.observationCone.initialSidePosition) * (Math.PI / 180);
    const finalAnglePoint = this.calculateAngle({ x: this.cone.observationCone.vertexPosition.x + 1000, y: this.cone.observationCone.vertexPosition.y }, this.cone.observationCone.vertexPosition, this.cone.observationCone.terminalSidePosition) * (Math.PI / 180);

    this.context.strokeStyle = observationColor;
    this.context.lineWidth = 1;
    this.context.fillStyle = this.hexToRGBA(observationColor, 0.2);
    this.context.beginPath();
    this.context.arc(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y, this.cone.coneSize, initialAnglePoint, finalAnglePoint, false);
    this.context.lineTo(this.cone.observationCone.vertexPosition.x, this.cone.observationCone.vertexPosition.y);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();

    // Dibujar 30º de angulo desde el punto previo
    this.context.strokeStyle = adjacentColor;
    this.context.lineWidth = 1;
    this.context.fillStyle = this.hexToRGBA(adjacentColor, 0.2);
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

    // Dibujar el cono de observación si se ha pasado el parametro pointSize
    if (pointSize) {
        // Dibujar punto en ángulo adyacente inicial
        this.context.strokeStyle = '#000';
        this.context.beginPath();
        this.context.arc(this.cone.initialAdjacentAngle.initialSidePosition.x, this.cone.initialAdjacentAngle.initialSidePosition.y, 5, 0, 2 * Math.PI);
        this.context.stroke();

        // Dibujar punto en ángulo adyacente final
        this.context.strokeStyle = '#000';
        this.context.beginPath();
        this.context.arc(this.cone.terminalAdjacentAngle.terminalSidePosition.x, this.cone.terminalAdjacentAngle.terminalSidePosition.y, 5, 0, 2 * Math.PI);
        this.context.stroke();
    }

    // Dibujar número de grados del angulo del cono de observación
    // this.context.fillStyle = observationColor;
    // this.context.font = '20px Arial';
    // this.context.fillText(`${this.cone.observationCone.angle.toFixed(2)}°`, this.cone.observationCone.vertexPosition.x + 10, this.cone.observationCone.vertexPosition.y - 10);
    // this.context.fillStyle = adjacentColor;
    // this.context.fillText(`${(this.cone.observationCone.angle + this.cone.terminalAdjacentAngle.angle + this.cone.initialAdjacentAngle.angle).toFixed(2)}°`, this.cone.observationCone.vertexPosition.x + 10, this.cone.observationCone.vertexPosition.y + 10);

    // //color de fondo del canvas
    // this.context.fillStyle = '#ff0';
    // this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);


  }
}
