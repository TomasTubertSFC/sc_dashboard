import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { HttpClient } from '@angular/common/http';
import { Point } from 'chart.js';

@Component({
  selector: 'app-episodes-map',
  templateUrl: './episodes-map.component.html',
  styleUrl: './episodes-map.component.scss'
})
export class EpisodesMapComponent {
  public cone!: Cone;
  public points!: Point[];
  public observation!: Point;
  public coneCanvas!: any;
  public imageLoaded: boolean = false;

  public canvasHeight: number = 1200;
  public canvasWidth: number = 1200;

  @ViewChild('canvasCone') canvas!: ElementRef<HTMLCanvasElement>;
  public context!: CanvasRenderingContext2D;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.http.get<any[]>('/assets/data/points.json').subscribe(data => {
      let getPoints = 70;
      this.points = data.slice(getPoints, getPoints + 5).map(point => {
        return {
          x: Number(point.longitude),
          y: Number(point.latitude)
        };
      });

      this.points = [
        { x:-21.954511459310332, y: 64.15324648934966 },
        { x:-21.9548085263586, y: 64.15332601355283 },
        { x:-21.95469386890137, y: 64.15338736063957 },
        { x:-21.95440722525831, y: 64.15331010873041 },
        { x:-21.954224815667267, y: 64.15327375481641 },
        { x:-21.954125793317843, y: 64.15331919720147 },
        { x:-21.953990289050214, y: 64.15328965965965 },
        { x:-21.95409973480484, y: 64.15324421722619 },
        { x:-21.953641104975937, y: 64.15327148269519 },
        { x:-21.953573352842117, y: 64.1533146529663 },
        { x:-21.953338826225067, y: 64.15327148269519 },
        { x:-21.95340136665628, y: 64.1532192238561 }
      ];
      this.observation = {y: 64.15304654177504, x: -21.954016347563222}
      // this.points = [
      //   { x: 9.75716266387601, y: 1.8538941362906889 },
      //   { x: 9.757227312574946, y: 1.8540453776735677 },
      //   { x: 9.757336007640191, y: 1.853997804094428 },
      //   { x: 9.757272779791778, y: 1.85384727276098 },
      //   { x: 9.757142771968644, y: 1.8538813553281615 },
      //   { x: 9.757036208179185, y: 1.853918988162013 },
      //   { x: 9.757061073063394, y: 1.853992123666997 },
      //   { x: 9.757082385821285, y: 1.8539864432395279 },
      //   { x: 9.757102988153912, y: 1.8540404072996897 },
      //   { x: 9.757186107909689, y: 1.8540112951095415 },
      //   { x: 9.757144192819169, y: 1.8538799352212083 },
      //   { x: 9.757147034520221, y: 1.8538586336167708 },
      //   { x: 9.757188239185478, y: 1.8538508230284265 },
      //   { x: 9.757181134932846, y: 1.8538039594975728 },
      //   { x: 9.75714206154338, y: 1.8538131901931372 },
      //   { x: 9.757147034520221, y: 1.853857923563307 }

      // ],
      // this.observation = {x: 9.757574710532872, y: 1.854080880347308};
      this.cone = new Cone(this.points, this.observation, true, this.canvasHeight, this.canvasWidth);
      console.log('Cono calculado para dibujo', this.cone);
      let coneCalculation = new Cone(this.points, this.observation);
      console.log('Cono con coordenadas',coneCalculation);
      this.drawCone();
    });
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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
    this.context.fillStyle = observationColor;
    this.context.font = '20px Arial';
    this.context.fillText(`${this.cone.observationCone.angle.toFixed(2)}°`, this.cone.observationCone.vertexPosition.x + 10, this.cone.observationCone.vertexPosition.y - 10);
    this.context.fillStyle = adjacentColor;
    this.context.fillText(`${(this.cone.observationCone.angle + this.cone.terminalAdjacentAngle.angle + this.cone.initialAdjacentAngle.angle).toFixed(2)}°`, this.cone.observationCone.vertexPosition.x + 10, this.cone.observationCone.vertexPosition.y + 10);

    // //color de fondo del canvas
    // this.context.fillStyle = '#ff0';
    // this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);


  }
}
