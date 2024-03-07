import { Component } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';
import { Subscription } from 'rxjs';

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

  private studyZone$! : Subscription;
  private episode$! : Subscription;
  private previewEpisode$! : Subscription;
  private observation$! : Subscription;
  private previewObservation$! : Subscription;


  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit() {

    this.studyZone$ = this.studyZoneService.studyZone.subscribe(studyZone => {
      if (studyZone) {
        this.studyZone = studyZone;
      }
    });

    this.episode$ = this.studyZoneService.episode.subscribe(episode => {
      if (episode) {
        this.episode = episode;
      }
    });

    this.previewEpisode$ = this.studyZoneService.previewEpisode.subscribe(episode => {
      this.previewEpisode = episode;
    });

    this.observation$ = this.studyZoneService.observation.subscribe(observation => {
      this.observation = observation;
      if (!this.episdoesSidebarVisible) this.onToggleEpisodesModal();
    });

    this.previewObservation$ = this.studyZoneService.previewObservation.subscribe(previewObservation => {
      this.previewObservation = previewObservation;
    });

  }

  public getEpisodeLength(start: string, end: string): string {
    const epStart = new Date(start);
    const epEnd = new Date(end);
    //devolvemos la diferencia entre las dos fechas en horas o dias dependiendo del tiempo que haya pasado
    const diff = (epEnd.getTime() - epStart.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    const hours = Math.floor(diff / 3600) % 24;
    return days > 0 ? `${days}d` : `${hours}h`;


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

  ngOnDestory() {
    this.studyZone$?.unsubscribe();
    this.episode$?.unsubscribe();
    this.previewEpisode$?.unsubscribe();
    this.observation$?.unsubscribe();
    this.previewObservation$?.unsubscribe();
  }

}
