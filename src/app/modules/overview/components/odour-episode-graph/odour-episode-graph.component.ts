import { Component, Input, OnInit } from '@angular/core';
import { Episode } from '../../../../models/study-zone';
import { direction } from 'html2canvas/dist/types/css/property-descriptors/direction';

@Component({
  selector: 'app-odour-episode-graph',
  templateUrl: './odour-episode-graph.component.html',
  styleUrl: './odour-episode-graph.component.scss',
})
export class OdourEpisodeGraphComponent implements OnInit {
  @Input() initDate!: Date;
  @Input() endDate!: Date;
  @Input() episodes!: Episode[];

  months!: string[];
  odourEpisodes!: number[];

  calculateMonthsBetweenDates(initDate: Date, endDate: Date): number {
    let months;
    months = (endDate.getFullYear() - initDate.getFullYear()) * 12;
    months -= initDate.getMonth();
    months += endDate.getMonth();
    const diferentBewteen = months <= 0 ? 0 : months;
    return diferentBewteen;
  }

  monthNamesBetweenDates(diferentBewteen: number): string[] {
    return [...new Array(diferentBewteen)].map((_, index) => {
      return new Date(2022, index, 1).toLocaleString('default', {
        month: 'long',
      });
    });
  }

  calculateOdourEpisodesPerMonth(episodes: Episode[], months: number) {
    const episodeDates = episodes.map((episode) =>
      new Date(episode.date).getMonth()
    );
    return [...new Array(months)].map((_, index) => {
      let count = 0;
      episodeDates.forEach((date) => {
        if (date === index) {
          count++;
        }
      });
      return count;
    });
  }

  ngOnInit(): void {
    const monthsBetween = this.calculateMonthsBetweenDates(
      this.initDate,
      this.endDate
    );
    this.months = this.monthNamesBetweenDates(monthsBetween);
    this.odourEpisodes = this.calculateOdourEpisodesPerMonth(
      this.episodes,
      monthsBetween
    );
  }
}
