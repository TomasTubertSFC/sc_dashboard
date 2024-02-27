import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Episode } from '../../../../models/episode';
import { EpisodeService } from '../../../../services/episode.service';

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

  public selectedEpisode: Episode | null = null;

  constructor(
    private http: HttpClient,
    private episodeService: EpisodeService
    ) {
    }

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

    this.episodeService.episode.subscribe(episode => {
      this.selectedEpisode = episode;
    });
  }

  public getHeightByIntensity(intensity: number): string {
    return `height: ${(intensity + 1) * 10}px`;
  }

  public selectEpisode(
    event: Event,
    term: number,
    episode: number
    ): void {
    let element = event.target as HTMLElement;
    //remover a classe active de todos os elementos
    document.querySelectorAll('.episode').forEach(element => {
      element.classList.remove('active');
    });
    element.classList.add('active');
    this.selectedEpisode = this.terms[term].episodes[episode];
    this.episodeService.episode = this.selectedEpisode;
  }

}
