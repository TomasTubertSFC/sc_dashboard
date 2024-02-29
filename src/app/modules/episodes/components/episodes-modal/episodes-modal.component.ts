import { Component } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode } from '../../../../models/study-zone';

@Component({
  selector: 'app-episodes-modal',
  templateUrl: './episodes-modal.component.html',
  styleUrl: './episodes-modal.component.scss'
})
export class EpisodesModalComponent {
  public episdoesSidebarVisible: boolean = false;

  public episode: Episode | null = null;

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit() {
    this.studyZoneService.episode.subscribe(episode => {
      if (episode) {
        this.episode = episode;
      }
    });
  }

  public onToggleEpisodesModal() {
    this.episdoesSidebarVisible = !this.episdoesSidebarVisible;
  }
  
}
