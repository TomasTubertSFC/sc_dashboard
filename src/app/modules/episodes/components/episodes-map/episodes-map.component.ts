import { Component } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { HttpClient } from '@angular/common/http';
import { Point } from 'chart.js';

@Component({
  selector: 'app-episodes-map',
  templateUrl: './episodes-map.component.html',
  styleUrl: './episodes-map.component.scss'
})
export class EpisodesMapComponent {
  private cone!: Cone;
  public points!: Point[];
  public observation!: Point;
  public canvas!: HTMLCanvasElement[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/points.json').subscribe(data => {
      let getPoints = 70;
        this.points = data.slice(getPoints, getPoints + 6).map(point => {
        return {
          x: point.longitude,
          y: point.latitude
        };
      });
      this.observation = this.points[0];
      //this.cone = new Cone(this.points, this.observation);
      //this.canvas[0] = new HTMLCanvasElement();
      //this.canvas[0].width = 800;
      //this.canvas[0].height = 800;
      //this.cone.drawCone(this.canvas[0])
    });
  }
}
