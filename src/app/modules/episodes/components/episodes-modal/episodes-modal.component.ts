import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { Subscription } from 'rxjs';

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

  /*
    * @method ngOnInit
    * @description Angular ejecuta la primera vez que se carga el componente
    * Se suscribe a los cambios en el estudio
    * Se suscribe a los cambios en el episodio seleccionado
    * Se suscribe a los cambios en el episodio como "vista previa"
    * Se suscribe a los cambios en la observación seleccionada
    * Se suscribe a los cambios en la observación como "vista previa"
    * @returns void
  */
  ngOnInit() {

    this.plausibilityWindSpeed = this.studyZoneService.plausibilityWindSpeed;
    this.plausibilityDistance = this.studyZoneService.plausibilityDistance;
    this.plausibilityMinOKObservations = this.studyZoneService.plausibilityMinOKObservations;

    // Se suscribe a los cambios en el estudio
    this.studyZone$ = this.studyZoneService.studyZone.subscribe(studyZone => {
      if (studyZone) {
        this.studyZone = studyZone;
      }
    });

    // Se suscribe a los cambios en el episodio seleccionado
    this.episode$ = this.studyZoneService.episode.subscribe(episode => {
      if (episode){
        this.episode = episode;
        if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.episode.id * 40;
      }
    });

    // Se suscribe a los cambios en el episodio como "vista previa"
    this.previewEpisode$ = this.studyZoneService.previewEpisode.subscribe(episode => {
      this.previewEpisode = episode;
      if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.previewEpisode? this.previewEpisode.id * 40 : this.episode? this.episode.id *40 : 0;
    });

    // Se suscribe a los cambios en la observación seleccionada
    this.observation$ = this.studyZoneService.observation.subscribe(observation => {
      this.observation = observation;
      if (!this.episdoesSidebarVisible && this.observation) this.onToggleEpisodesModal();
    });

    // Se suscribe a los cambios en la observación como "vista previa"
    this.previewObservation$ = this.studyZoneService.previewObservation.subscribe(previewObservation => {
      if(this.previewObservation === previewObservation) return;
      this.previewObservation = previewObservation;
      if(this.observationButtonPreview) this.observationButtonPreview.dispatchEvent( new Event('mouseleave'));
      this.observationButtonPreview = document.getElementById(`obsButton${previewObservation}`) as HTMLElement;
      if(this.observationButtonPreview) this.observationButtonPreview.dispatchEvent( new Event('mouseover'));
      if(this.episdoesSidebarVisible && this.episodesContainer) this.episodesContainer.nativeElement.scrollTop = this.episode? this.episode.id * 40 : this.episodesContainer.nativeElement.scrollTop;
    });

  }

  /*
    * @method getInconvenienceInBase100
    * @description Calcula el valor de incomodidad en base 100
    * @param inconvenience {number}
    * @returns number (inconvenience en base 100)
  */
  public getInconvenienceInBase100(inconvenience: number): number {
    return Math.round(inconvenience / 7 * 100);
  }

  /*
    * @method getEpisodeLength
    * @description Calcula la duración de un episodio
    * @param start {string}
    * @param end {string}
    * @returns string (días u horas)
  */
  public getEpisodeLength(start: string, end: string): string {
    const epStart = new Date(start);
    const epEnd = new Date(end);
    const diff = (epEnd.getTime() - epStart.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    const hours = Math.floor(diff / 3600) % 24;
    let dayText = days > 1 ? 'dias' : 'dia';
    let hourText = hours > 1 ? 'horas' : 'hora';
    return days > 0 ? `${days} ${dayText}` : hours > 0 ? `${hours} ${hourText}` : 'Menos de 1 hora';
  }

  /*
    * @method onToggleEpisodesModal
    * @description Cambia la visibilidad del modal de episodios
    * @emits episodesSidebarVisible {boolean} este evento se emite para tener en cuenta si el
    * modal de episodios está visible o no a la hora de mostrar elementos centrados en el mapa
    * @returns void
  */
  public onToggleEpisodesModal():void {
    this.episdoesSidebarVisible = !this.episdoesSidebarVisible;
    this.episodesSidebarVisible.emit(this.episdoesSidebarVisible);
    // Espera a que se muestre el modal para hacer scroll al episodio seleccionado
    setTimeout(() => {
      if(this.episdoesSidebarVisible) this.episodesContainer.nativeElement.scrollTop = this.episode? this.episode.id * 40 : 0;
    }, 300);
  }

  /*
    * @method observationSelected
    * @description Selecciona una observación
    * @param id {number | null}
    * @returns void
  */
  public observationSelected(id:number | null = null):void {
    if(id !== null){
      this.studyZoneService.observation = id;
    }
  }

  /*
    * @method observationPreview
    * @description Marca una observación como "vista previa"
    * @param id {number | null}
    * @returns void
  */
  public observationPreview(id:number | null = null):void {
    // Si no hay observación seleccionada, no se puede previsualizar
    if(id === null) this.observationButtonPreview = null;
    this.previewObservation = id;
    // Si la observación seleccionada no es la misma que la de previsualización, se actualiza
    if(this.studyZoneService.previewObservation.value !== id) this.studyZoneService.previewObservation = id;
  }

  /*
    * @method selectEpisode
    * @description Marca un episodio como seleccionado
    * @param episode {Episode}
    * @returns void
  */
  public selectEpisode(episode: Episode): void {
    if(episode.id !== this.studyZoneService.episode.value?.id) this.studyZoneService.episode = episode;
  }

  /*
    * @method hidePreviewEpisode
    * @description Oculta la previsualización de un episodio
    * @returns void
  */
  public hidePreviewEpisode(): void {
    this.studyZoneService.previewEpisode = null;
  }

  /*
    * @method episodePreview
    * @description Muestra la previsualización de un episodio
    * @param id {number}
    * @returns void
  */
  public episodePreview(id:number): void {
    this.studyZoneService.previewEpisode = this.studyZone ? this.studyZone.episodes[id] : null;
  }

  /*
    * @method ngOnDestroy
    * @description Angular ejecuta cuando el componente se destruye
    * Desuscribe todos los observables
    * @returns void
  */
  ngOnDestroy() {
    this.studyZone$?.unsubscribe();
    this.episode$?.unsubscribe();
    this.previewEpisode$?.unsubscribe();
    this.observation$?.unsubscribe();
    this.previewObservation$?.unsubscribe();
  }

}
