import { Component } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';

@Component({
  selector: 'app-episodes-modal',
  templateUrl: './episodes-modal.component.html',
  styleUrl: './episodes-modal.component.scss'
})
export class EpisodesModalComponent {
  public episdoesSidebarVisible: boolean = false;
  public studyZone: StudyZone | null = null;
  public episode: Episode | null = null;
  public previewEpisode: Episode | null = null;
  public observation: number | null = null;
  public previewObservation: number | null = null;

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit() {

    this.studyZoneService.studyZone.subscribe(studyZone => {
      if (studyZone) {
        this.studyZone = studyZone;
      }
    });

    this.studyZoneService.episode.subscribe(episode => {
      if (episode) {
        this.episode = episode;
      }
    });
    this.studyZoneService.previewEpisode.subscribe(episode => {
      this.previewEpisode = episode;
    });

    this.studyZoneService.observation.subscribe(observation => {
      this.observation = observation;
      if (!this.episdoesSidebarVisible) this.onToggleEpisodesModal();
    });

    this.studyZoneService.previewObservation.subscribe(previewObservation => {
      this.previewObservation = previewObservation;
    });

  }

  public onToggleEpisodesModal() {
    this.episdoesSidebarVisible = !this.episdoesSidebarVisible;
  }

  public observationSelected(id:number | null = null):void {
    if(id !== null) this.studyZoneService.observation = id;
  }

  public observationPreview(id:number | null = null):void {
    if(this.studyZoneService.previewObservation.value !== id) this.studyZoneService.previewObservation = id;
  }

  public selectEpisode(episode: Episode): void {
    if(episode.id !== this.studyZoneService.episode.value?.id) this.studyZoneService.episode = episode;
  }

  public hidePreviewEpisode(): void {
    this.studyZoneService.previewEpisode = null;
  }

  public episodePreview(id:number): void {
    this.studyZoneService.previewEpisode = this.studyZone ? this.studyZone.episodes[id] : null;
  }

}
