import { Component } from '@angular/core';
import { EpisodeService } from '../../../../services/episode.service';
import { Episode } from '../../../../models/episode';

@Component({
  selector: 'app-episodes-modal',
  templateUrl: './episodes-modal.component.html',
  styleUrl: './episodes-modal.component.scss'
})
export class EpisodesModalComponent {
  public episdoesSidebarVisible: boolean = false;

  public episode: Episode | null = null;

  constructor(
    private episodeService: EpisodeService
  ) { }

  ngOnInit() {
    this.episodeService.episode.subscribe(episode => {
      if (episode) {
        this.episode = episode;
      }
    });
  }
  public onToggleEpisodesModal() {
    this.episdoesSidebarVisible = !this.episdoesSidebarVisible;
  }
}
