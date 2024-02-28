import { ElementRef } from "@angular/core";

export interface Point {
  x: number;
  y: number;
  id?: number | undefined | null;
}
interface ConvexHull {
  prevPoint: Point;
  observation: Point;
  nextPoint: Point;
}
interface Angle{
  angle: number;
  vertexPosition: Point;
  initialSidePosition: Point;
  terminalSidePosition: Point;
}

export class Cone {

  public initialAdjacentAngle!: Angle;
  public observationCone!: Angle;
  public terminalAdjacentAngle!: Angle;
  public completeConeCoordinates!: Angle;
  public coneSize!: number;
  public convexHull!: Point[];
  private minX: number = 0;
  private maxX: number = 0;
  private minY: number = 0;
  private maxY: number = 0;
  private mapWidth: number = 0;
  private mapHeight: number = 0;
  private mapCenterX: number = 0;
  private mapCenterY: number = 0;
  private scale: number = 0;

  public imageCoordinates!: number[][];


  constructor(public points: Point[], public observation: Point, toDraw:boolean = false, canvasHeight:number = 0, canvasWidth:number = 0) {
    if (!points.find(point => point === observation)) {
        points.push(observation);
    }
    this.convexHull = this.getCompleteConvexHull(this.points);
    this.coneSize = this.getConeSize(this.convexHull, observation);
    let observationConvexHull = this.getObservationConvexHull(this.convexHull, this.observation);

    if(toDraw && canvasHeight && canvasWidth){

      if(observationConvexHull === null){

        this.points.forEach((point, i) => {
          if (i === 0) {
            this.minX = this.maxX = point.x;
            this.minY = this.maxY = point.y;
          } else {
            this.minX = Math.min(point.x, this.minX);
            this.minY = Math.min(point.y, this.minY);
            this.maxX = Math.max(point.x, this.maxX);
            this.maxY = Math.max(point.y, this.maxY);
          }
        });

        this.imageCoordinates = [
          [this.minX, this.maxY],
          [this.maxX, this.maxY],
          [this.maxX, this.minY],
          [this.minX, this.minY]
        ];
      }
      else{
        this.imageCoordinates = [
          [this.observation.x - this.coneSize, this.observation.y + this.coneSize],
          [this.observation.x + this.coneSize, this.observation.y + this.coneSize],
          [this.observation.x + this.coneSize, this.observation.y - this.coneSize],
          [this.observation.x - this.coneSize, this.observation.y - this.coneSize]
        ];
        this.coneSize = (Math.min(canvasHeight, canvasWidth) / 2) - 2;
        this.minX = this.observation.x - this.coneSize;
        this.maxX = this.observation.x + this.coneSize;
        this.minY = this.observation.y - this.coneSize;
        this.maxY = this.observation.y + this.coneSize;
      }

      this.mapWidth = this.maxX - this.minX;
      this.mapHeight = this.maxY - this.minY;
      this.mapCenterX = (this.maxX + this.minX) / 2;
      this.mapCenterY = (this.maxY + this.minY) / 2;
      this.scale = Math.min(canvasWidth / this.mapWidth, canvasHeight / this.mapHeight);
      this.points = this.points.map(point => ({
        x: (point.x - this.mapCenterX) * this.scale + canvasWidth / 2 - 1,
        y: ((point.y + ( (this.observation.y - point.y) * 2 )) - this.mapCenterY) * this.scale + canvasHeight / 2 - 1,
        id: point.id
      }));
      this.observation = {
        x: (this.observation.x - this.mapCenterX) * this.scale + canvasWidth / 2 - 1,
        y: (this.observation.y - this.mapCenterY) * this.scale + canvasHeight / 2 - 1,
        id: this.observation.id
      };
    }

    this.convexHull = this.getCompleteConvexHull(this.points);
    observationConvexHull = this.getObservationConvexHull(this.convexHull, this.observation);
    if (observationConvexHull === null) {
      return;
    }
    else{
      this.calculateCone(observationConvexHull, this.coneSize);
    }
  }

  /**
   * Calcula la envolvente convexa de un conjunto de puntos utilizando el algoritmo de Graham.
   *
   * @param {Object[]} points - Un array de objetos que representan los puntos. Cada objeto debe tener propiedades 'x' e 'y'.
   * @returns {Object[]} - Un array de objetos que representan los puntos de la envolvente convexa.
   *
   * @example
   * let points = [
   *     {x: 10, y: 20},
   *     {x: 30, y: 40},
   *     {x: 50, y: 60},
   *     // Más puntos...
   * ];
   * let convexHull = getCompleteConvexHull(points);
   */
  private getCompleteConvexHull(points: Point[]) {
    const n = points.length;

    if (n < 2) {
        return points;
    }

    // Ordenar puntos por coordenada y
    points.sort((a, b) => a.y - b.y);

    // Función auxiliar para determinar la orientación de tres puntos
    function orientation(p:Point, q:Point, r:Point) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0; // Colineales
        return (val > 0) ? 1 : 2; // En sentido horario o antihorario
    }

    const hull = [];

    // Construir la envolvente convexa
    let idx = 0;

    for (let i = 0; i < n; i++) {
        while (idx >= 2 && orientation(hull[idx - 2], hull[idx - 1], points[i]) !== 1) {
            hull.pop();
            idx--;
        }

        hull.push(points[i]);
        idx++;
    }

    const lowerHull = hull.slice();

    hull.length = 0;
    idx = 0;

    for (let i = n - 1; i >= 0; i--) {
        while (idx >= 2 && orientation(hull[idx - 2], hull[idx - 1], points[i]) !== 1) {
            hull.pop();
            idx--;
        }

        hull.push(points[i]);
        idx++;
    }

    hull.pop();

    return lowerHull.concat(hull);

  }

  /**
   * Devuelve el punto de observación y sus puntos adyacentes en la envolvente convexa.
   *
   * @param {Object[]} convexHull - Un array de objetos que representan los puntos de la envolvente convexa.
   * @param {Object} observation - Un objeto que representa el punto de observación. Debe tener propiedades 'x' e 'y'. Esta coordenada debe estar en la envolvente convexa. Si no está, la función devolverá null y no se podrá calcular el cono de observación ya que esta dentro de la Zona de estudio.
   * @returns {Object[]} Un array de objetos que representan los puntos de la envolvente convexa.
   *
   * @example
   * let convexHull = [
   *     {x: 10, y: 20},
   *     {x: 30, y: 40},
   *     {x: 50, y: 60},
   *     // Más puntos...
   * ];
   * let observation = {x: 30, y: 40};
   * let convexHull = getObservationConvexHull(puntos, puntoObservacion);
   */
  private getObservationConvexHull(convexHull:Point[], observation:Point) {

    convexHull = convexHull.filter((item, index) => {
        return convexHull.indexOf(item) === index;
    });

    const idx = convexHull.findIndex(point => point.x === observation.x && point.y === observation.y);

    if (idx === -1) {
        return null;
    }

    const prevPoint = idx === 0 ? convexHull[convexHull.length - 1] : convexHull[idx - 1];
    const nextPoint = idx === convexHull.length - 1 ? this.points[0] : convexHull[idx + 1];

    return {
        observation: convexHull[idx],
        prevPoint,
        nextPoint
    };

  }

  /**
   * Calcula la distancia máxima desde un punto de observación hasta cualquier punto en una envolvente convexa.
   *
   * @param {Object[]} convexHull - Un array de objetos que representan los puntos de la envolvente convexa. Cada objeto debe tener propiedades 'x', 'y'.
   * @param {Object} observation - Un objeto que representa el punto de observación. Debe tener propiedades 'x' e 'y'.
   * @returns {number} La distancia máxima desde el punto de observación hasta cualquier punto en la envolvente convexa.
   *
   * @example
   * let convexHull = [
   *     {id: 1, x: 10, y: 20},
   *     {id: 2, x: 30, y: 40},
   *     {id: 3, x: 50, y: 60},
   *     // Más puntos...
   * ];
   * let observation = {x: 15, y: 25};
   * let maxDistance = getConeSize(observationConvexHull, observation);
   */
  private getConeSize(convexHull:Point[], observation:Point) {

    // Función para calcular la distancia euclidiana entre dos puntos
    function calculateDistance(p1:Point, p2:Point) {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calcula la distancia de la observación a cada punto de la envolvente convexa
    let distance = convexHull.map(point => ({
        id: point.id,
        distance: calculateDistance(observation, point)
    }));

    // Encuentra el punto más lejano a la observcación
    let farPoint = distance.reduce((max, point) => point.distance > max.distance ? point : max, { distance: -Infinity });

    return farPoint.distance;
  }

  /**
   * Calcula el ángulo en grados entre tres puntos dados.
   *
   * @param {Object} p1 - El primer punto uno de los lados del ángulo. Debe ser un objeto con propiedades 'x' e 'y'.
   * @param {Object} vertex - El vértice alrededor del cual se calcula el ángulo. Debe ser un objeto con propiedades 'x' e 'y'.
   * @param {Object} p2 - El segundo punto el otro lado del ángulo. Debe ser un objeto con propiedades 'x' e 'y'.
   * @returns {number} El ángulo en grados entre los tres puntos. Si p1 y p2 son el mismo punto, se devuelve 0.
   *
   * @example
   * let p1 = {x: 10, y: 20};
   * let vertex = {x: 30, y: 40};
   * let p2 = {x: 50, y: 60};
   * let angle = 90
   */
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

  /**
   * Calcula el cono de observación y los ángulos adyacentes basándose en una envolvente convexa y un tamaño de cono.
   *
   * @param {Object} convexHull - Un objeto que representa la envolvente convexa. Debe tener propiedades 'prevPoint', 'point' y 'nextPoint', cada una de las cuales es un objeto con propiedades 'x' e 'y'.
   * @param {number} coneSize - El tamaño del cono.
   * @param {number} [adjacentDegrees=30] - Los grados adyacentes al ángulo de observación. Es opcional y su valor por defecto es 30.
   * @returns {Object} Un objeto que contiene los ángulos adyacentes iniciales y terminales, el cono de observación y las coordenadas completas del cono.
   *
   * @example
   * let convexHull = {
   *     prevPoint: {x: 10, y: 20},
   *     point: {x: 30, y: 40},
   *     nextPoint: {x: 50, y: 60},
   * };
   * let coneSize = 100;
   * let cone = calculateCone(convexHull, coneSize);
   */
  private calculateCone(convexHull:ConvexHull, coneSize:number, adjacentDegrees = 30) {

    const angle = this.calculateAngle(convexHull.prevPoint, convexHull.observation, convexHull.nextPoint);

    // Calculo de la posicion lado externo del cono inicial de 30 grados a partir del lado inicial del angulo de observación
    const initialAnglePoint = this.calculateAngle({ x: convexHull.observation.x + 1000, y: convexHull.observation.y }, convexHull.observation, convexHull.prevPoint) * (Math.PI / 180);
    const initialAnglePointInRadians = initialAnglePoint + (- adjacentDegrees * (Math.PI / 180));
    const pointRadiusInitialCone = {
        x: convexHull.observation.x + coneSize * Math.cos(initialAnglePointInRadians),
        y: convexHull.observation.y + coneSize * Math.sin(initialAnglePointInRadians)
    };

    // Calculo de la posicion lado externo del cono terminal de 30 grados a partir del lado terminal del angulo de observación
    const terminalAnglePoint = this.calculateAngle({ x: convexHull.observation.x + 1000, y: convexHull.observation.y }, convexHull.observation, convexHull.nextPoint) * (Math.PI / 180);
    const terminalAnglePointInRadians = terminalAnglePoint + (adjacentDegrees * (Math.PI / 180));
    const pointRadiusTerminalCone = {
        x: convexHull.observation.x + coneSize * Math.cos(terminalAnglePointInRadians),
        y: convexHull.observation.y + coneSize * Math.sin(terminalAnglePointInRadians)
    };

    this.observationCone = {
        angle: angle,
        vertexPosition: convexHull.observation,
        initialSidePosition: convexHull.prevPoint,
        terminalSidePosition: convexHull.nextPoint,
    };

    this.initialAdjacentAngle = {
        angle: adjacentDegrees,
        vertexPosition: convexHull.observation,
        initialSidePosition: pointRadiusInitialCone,
        terminalSidePosition: convexHull.prevPoint,
    };

    this.terminalAdjacentAngle = {
        angle: adjacentDegrees,
        vertexPosition: convexHull.observation,
        initialSidePosition: convexHull.nextPoint,
        terminalSidePosition: pointRadiusTerminalCone,
    };

    this.completeConeCoordinates = {
      angle: this.terminalAdjacentAngle.angle + this.observationCone.angle + this.initialAdjacentAngle.angle,
      vertexPosition: convexHull.observation,
      initialSidePosition: pointRadiusInitialCone,
      terminalSidePosition: pointRadiusTerminalCone
    };

  }

  /**
   * Dibuja puntos en un contexto de canvas proporcionado.
   *
   * @param {CanvasRenderingContext2D} context - El contexto 2D del canvas en el que se dibujarán los puntos.
   * @param {Object[]} points - Un array de objetos que representan los puntos a dibujar. Cada objeto debe tener propiedades 'x' e 'y'.
   * @param {Object} observation - Un objeto que representa el punto de observación. Debe tener propiedades 'x' e 'y'. Debe existir en el array de puntos.
   * @param {string} [defaultColor='#000'] - El color por defecto para los puntos. Es opcional y su valor por defecto es '#000'.
   * @param {string} [observationColor='#0f0'] - El color para el punto de observación. Es opcional y su valor por defecto es '#0f0'.
   * @param {Number} [pointSize=5] - El tamaño de los puntos. Es opcional y su valor por defecto es 5.
   *
   * @example
   * let context = document.getElementById('myCanvas').getContext('2d');
   * let points = [
   *     {x: 10, y: 20},
   *     {x: 30, y: 40},
   *     {x: 50, y: 60},
   *     // Más puntos...
   * ];
   * let observation = {x: 30, y: 40};
   * drawPoints(context, points, observation);
   */
  private drawPoints(canvas:HTMLCanvasElement, points:Point[] , observation:Point, defaultColor:string = '#000', observationColor:string = '#0f0', pointSize:number = 5) {
    let ctx = canvas.getContext('2d');
    if (ctx){
      ctx.fillStyle = defaultColor;
      points.forEach((point) => {
        if (ctx){
          if (defaultColor !== observationColor && point.x === observation.x && point.y === observation.y) {
            ctx.fillStyle = observationColor; // Color diferente al resto para el punto de observación
          }
          ctx.beginPath();
          ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }
  }

  /**
   * Convierte un color hexadecimal a formato RGBA.
   *
   * @param {string} hex - El color en formato hexadecimal.
   * @param {number} [alpha=1] - La opacidad del color. Es opcional y su valor por defecto es 1.
   * @returns {string} El color en formato RGBA.
   *
   * @example
   * let hexColor = "#FFFFFF";
   * let rgbaColor = hexToRGBA(hexColor, 0.5);
   */
  private hexToRGBA(hex:string, alpha:number = 1) {
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Dibuja un cono de observación y sus ángulos adyacentes en un contexto de canvas.
   *
   * @param {CanvasRenderingContext2D} context - El contexto 2D del canvas en el que se dibujará el cono.
   * @param {Object} cone - Un objeto que representa el cono y sus ángulos adyacentes.
   * @param {number} coneSize - El tamaño del cono.
   * @param {string} [adjacentColor='#00F'] - El color de los ángulos adyacentes. Es opcional y su valor por defecto es '#00F'.
   * @param {string} [observationColor='#F00'] - El color del cono de observación. Es opcional y su valor por defecto es '#F00'.
   * @param {number} [pointSize=null] - El tamaño de los puntos que representan los ángulos adyacentes. Es opcional y su valor por defecto es null.
   *
   * @example
   * let context = document.getElementById('canvas').getContext('2d');
   * let cone = {
   *     observationCone: {
   *         vertexPosition: {x: 30, y: 40},
   *         initialSidePosition: {x: 10, y: 20},
   *         terminalSidePosition: {x: 50, y: 60},
   *         angle: 90,
   *     },
   *     initialAdjacentAngle: {
   *         initialSidePosition: {x: 10, y: 20},
   *         angle: 30,
   *     },
   *     terminalAdjacentAngle: {
   *         terminalSidePosition: {x: 50, y: 60},
   *         angle: 30,
   *     },
   * };
   * let coneSize = 100;
   * drawCone(context, cone, coneSize);
   */
  public drawCone(canvas:ElementRef<HTMLCanvasElement>, adjacentColor:string = '#00F', observationColor:string = '#F00', pointSize:number|null = null) {


    // Dibujar el arco del angulo de observacion abarcando todos los puntos
    const initialAnglePoint = this.calculateAngle({ x: this.observationCone.vertexPosition.x + 1000, y: this.observationCone.vertexPosition.y }, this.observationCone.vertexPosition, this.observationCone.initialSidePosition) * (Math.PI / 180);
    const finalAnglePoint = this.calculateAngle({ x: this.observationCone.vertexPosition.x + 1000, y: this.observationCone.vertexPosition.y }, this.observationCone.vertexPosition, this.observationCone.terminalSidePosition) * (Math.PI / 180);
    console.log(canvas);
    let ctx = canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;


    if (ctx){
      ctx.strokeStyle = observationColor;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.hexToRGBA(observationColor, 0.2);
      ctx.beginPath();
      ctx.arc(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y, this.coneSize, initialAnglePoint, finalAnglePoint, false);
      ctx.lineTo(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Dibujar 30º de angulo desde el punto previo
      ctx.strokeStyle = adjacentColor;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.hexToRGBA(adjacentColor, 0.2);
      ctx.beginPath();
      ctx.arc(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y, this.coneSize, initialAnglePoint, initialAnglePoint + (- this.initialAdjacentAngle.angle * (Math.PI / 180)), true);
      ctx.lineTo(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Dibujar ángulo adyacente final
      ctx.beginPath();
      ctx.arc(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y, this.coneSize, finalAnglePoint, finalAnglePoint + (this.terminalAdjacentAngle.angle * (Math.PI / 180)), false);
      ctx.lineTo(this.observationCone.vertexPosition.x, this.observationCone.vertexPosition.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Dibujar el cono de observación si se ha pasado el parametro pointSize
      if (pointSize) {
          // Dibujar punto en ángulo adyacente inicial
          ctx.strokeStyle = '#000';
          ctx.beginPath();
          ctx.arc(this.initialAdjacentAngle.initialSidePosition.x, this.initialAdjacentAngle.initialSidePosition.y, 5, 0, 2 * Math.PI);
          ctx.stroke();

          // Dibujar punto en ángulo adyacente final
          ctx.strokeStyle = '#000';
          ctx.beginPath();
          ctx.arc(this.terminalAdjacentAngle.terminalSidePosition.x, this.terminalAdjacentAngle.terminalSidePosition.y, 5, 0, 2 * Math.PI);
          ctx.stroke();
      }

      // Dibujar número de grados del angulo del cono de observación
      ctx.fillStyle = '#F00';
      ctx.font = '20px Arial';
      ctx.fillText(`${this.observationCone.angle.toFixed(2)}°`, this.observationCone.vertexPosition.x + 10, this.observationCone.vertexPosition.y - 10);
      ctx.fillStyle = '#00F';
      ctx.fillText(`${(this.observationCone.angle + this.terminalAdjacentAngle.angle + this.initialAdjacentAngle.angle).toFixed(2)}°`, this.observationCone.vertexPosition.x + 10, this.observationCone.vertexPosition.y + 10);
    }
  }
}
