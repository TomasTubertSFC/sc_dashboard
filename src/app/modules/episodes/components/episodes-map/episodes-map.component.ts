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
  public cone: Cone | undefined;
  public points!: Point[];
  public observation!: Point;

  constructor(private http: HttpClient) {

    this.http.get<any[]>('/assets/data/points.json').subscribe(data => {
      let getPoints = 70;
        this.points = data.slice(getPoints, getPoints + 5).map(point => {
        return {
          x: Number(point.longitude),
          y: Number(point.latitude)
        };
      });
      this.observation = this.points[4];
    });
  }

  ngOnInit(): void {
  }
}
