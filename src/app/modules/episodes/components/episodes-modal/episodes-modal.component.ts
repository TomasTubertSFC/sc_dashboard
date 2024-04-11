import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';
import { Subscription } from 'rxjs';
import { withHttpTransferCacheOptions } from '@angular/platform-browser';

@Component({
  selector: 'app-episodes-modal',
  templateUrl: './episodes-modal.component.html',
  styleUrl: './episodes-modal.component.scss'
})
export class EpisodesModalComponent implements OnDestroy {

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
  private observationButtonPreview: HTMLElement | null = null;

  public plausibilityWindSpeed!: number;
  public plausibilityDistance!: number;
  public plausibilityMinOKObservations!: number;

  @Output() public episodesSidebarVisible = new EventEmitter<boolean>();

  @ViewChild('episodesContainer') episodesContainer!: ElementRef;

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit() {

    this.plausibilityWindSpeed = this.studyZoneService.plausibilityWindSpeed;
    this.plausibilityDistance = this.studyZoneService.plausibilityDistance;
    this.plausibilityMinOKObservations = this.studyZoneService.plausibilityMinOKObservations;

    this.studyZone$ = this.studyZoneService.studyZone.subscribe(studyZone => {
      if (studyZone) {
        this.studyZone = studyZone;
      }
    });

    this.episode$ = this.studyZoneService.episode.subscribe(episode => {
      if (episode){
        this.episode = episode;
        if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.episode.id * 40;
      }
    });

    this.previewEpisode$ = this.studyZoneService.previewEpisode.subscribe(episode => {
      this.previewEpisode = episode;
      if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.previewEpisode? this.previewEpisode.id * 40 : this.episode? this.episode.id *40 : 0;
    });

    this.observation$ = this.studyZoneService.observation.subscribe(observation => {
      this.observation = observation;
      if (!this.episdoesSidebarVisible && this.observation) this.onToggleEpisodesModal();
    });

    this.previewObservation$ = this.studyZoneService.previewObservation.subscribe(previewObservation => {
      if(this.previewObservation === previewObservation) return;
      this.previewObservation = previewObservation;
      if(this.observationButtonPreview) this.observationButtonPreview.dispatchEvent( new Event('mouseleave'));
      this.observationButtonPreview = document.getElementById(`obsButton${previewObservation}`) as HTMLElement;
      if(this.observationButtonPreview) this.observationButtonPreview.dispatchEvent( new Event('mouseover'));
      if(this.episdoesSidebarVisible && this.episodesContainer) this.episodesContainer.nativeElement.scrollTop = this.episode? this.episode.id * 40 : this.episodesContainer.nativeElement.scrollTop;
    });

  }

  public getInconvenienceInBase100(inconvenience: number): number {
    return Math.round(inconvenience / 7 * 100);
  }

  public getEpisodeLength(start: string, end: string): string {
    const epStart = new Date(start);
    const epEnd = new Date(end);
    const diff = (epEnd.getTime() - epStart.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    const hours = Math.floor(diff / 3600) % 24;
    let dayText = days > 1 ? 'days' : 'day';
    let hourText = hours > 1 ? 'hours' : 'hour';
    return days > 0 ? `${days} ${dayText}` : `${hours} ${hourText}`;
  }


  public onToggleEpisodesModal() {
    this.episdoesSidebarVisible = !this.episdoesSidebarVisible;
    this.episodesSidebarVisible.emit(this.episdoesSidebarVisible);
    setTimeout(() => {
      if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.episode? this.episode.id * 40 : 0;
    }, 300);
  }

  public observationSelected(id:number | null = null):void {
    if(id !== null){
      this.studyZoneService.observation = id;
    }
  }

  public observationPreview(id:number | null = null):void {
    if(id === null) this.observationButtonPreview = null;
    this.previewObservation = id;
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

  ngOnDestroy() {
    this.studyZone$?.unsubscribe();
    this.episode$?.unsubscribe();
    this.previewEpisode$?.unsubscribe();
    this.observation$?.unsubscribe();
    this.previewObservation$?.unsubscribe();
  }

}
