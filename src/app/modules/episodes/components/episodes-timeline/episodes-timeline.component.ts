import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Cone } from '../../../../models/cone';
import { Point } from 'chart.js';
import { Episode } from '../../../../models/episode';

@Component({
  selector: 'app-episodes-timeline',
  templateUrl: './episodes-timeline.component.html',
  styleUrl: './episodes-timeline.component.scss'
})
export class EpisodesTimelineComponent {

  public terms  : {
    year: number;
    month: number;
    episodes: Episode[];
    }[] = []
  public episodes: Episode[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Episode[]>('/assets/data/episodes.json').subscribe(data => {
      this.episodes = data;
      //separar array por meses y años
      this.episodes.forEach(episode => {
        const date = new Date(episode.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const term = this.terms.find(term => term.year === year && term.month === month);
        if(term){
          term.episodes.push(episode);
        } else {
          this.terms.push({
            year: year,
            month: month,
            episodes: [episode]
          });
        }
      });
    });
    console.log(this.terms);
  }

  public getHeightByIntensity(intensity: number): string {
    return `height: ${(intensity + 1) * 10}px`;
  }

}
