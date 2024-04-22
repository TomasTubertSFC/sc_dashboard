import { Component, Input, OnInit } from '@angular/core';
import { Episode } from '../../../../models/study-zone';
import { SliderModule } from 'primeng/slider';

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
  selectedMonths!: string[];
  odourEpisodes!: number[];
  odourEpisodesSelected!: number[];
  firstPage: number = 0;
  numberOfPages: number = 1;

  calculateMonthsBetweenDates(initDate: Date, endDate: Date): number {
    let months;
    months = (endDate.getFullYear() - initDate.getFullYear()) * 12;
    months -= initDate.getMonth();
    months += endDate.getMonth();
    const diferentBewteen = months <= 0 ? 0 : months;
    return diferentBewteen;
  }

  monthNamesBetweenDates(diferentBewteen: number, initDate: Date): string[] {
    return [...new Array(diferentBewteen)].map((_, index) => {
      const date = new Date(initDate.getFullYear(), index).toLocaleString(
        'default',
        {
          month: 'long',
          year: 'numeric',
        }
      );
      return date;
    });
  }

  getDaysfromLastEpisode() {
    const episodeDates = this.episodes
      .map((episode) => new Date(episode.date))
      .sort((a, b) => b.getTime() - a.getTime());
    const lastEpisode = episodeDates[0];
    const today = new Date();
    const differenceInTime = today.getTime() - lastEpisode.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.round(differenceInDays);
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

  splitIntoGroups(array: string[], groupSize: number): string[][] {
    const groups: string[][] = [];

    for (let i = 0; i < array.length; i += groupSize) {
      groups.push(array.slice(i, i + groupSize));
    }

    return groups;
  }

  onPageChange(event: any) {
    this.selectedMonths = [...this.months].slice(
      event.first,
      event.first + event.rows
    );
    this.odourEpisodesSelected = [...this.odourEpisodes].slice(
      event.first,
      event.first + event.rows
    );
  }

  ngOnInit(): void {
    const monthsBetween = this.calculateMonthsBetweenDates(
      this.initDate,
      this.endDate
    ) + 1
    this.months = this.monthNamesBetweenDates(monthsBetween, this.initDate);
    this.selectedMonths = [...this.months].slice(0, 6);
    this.odourEpisodes = this.calculateOdourEpisodesPerMonth(
      this.episodes,
      monthsBetween
    );
    this.odourEpisodesSelected = [...this.odourEpisodes].splice(0, 6);
    this.numberOfPages = this.splitIntoGroups(this.months, 6).length;
  }
}
