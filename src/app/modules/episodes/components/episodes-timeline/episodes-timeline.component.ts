import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Button } from 'primeng/button';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-episodes-timeline',
  templateUrl: './episodes-timeline.component.html',
  styleUrl: './episodes-timeline.component.scss'
})
export class EpisodesTimelineComponent  implements OnDestroy {

  public terms  : {
    year: number;
    month: number;
    episodes: Episode[];
    }[] = []

  public studyZone: StudyZone | null = null;

  public episode: Episode | null = null;
  public episodePreview: Episode | null = null;

  @ViewChild('termsSlider') termsSlider!: ElementRef;
  @ViewChild('nextButton') nextButton!: Button;
  @ViewChild('prevButton') prevButton!: Button;
  private activeBarEpisode!: HTMLElement;
  private previewBarEpisode!: HTMLElement;
  public currentElement:number = 1;
  public galleryElementWidth!:number;
  public galleryTotalWidth!:number;
  public currentScroll!:number;

  private studyZone$! : Subscription;
  private episode$! : Subscription;
  private episodePreview$! : Subscription;

  /*
    * @description: Constructor del componente EpisodesTimelineComponent
    * @param studyZoneService: StudyZoneService
    * @returns void
  */
  constructor(private studyZoneService: StudyZoneService) { }

  /*
    * @description: Método que se ejecuta al inicializar el componente
    * Observa los cambios en el servicio de StudyZone, en el episodio seleccionado y en el episodio previsualizado    *
    * @returns void
   */
  ngOnInit() {

    this.studyZone$ = this.studyZoneService.studyZone.subscribe(data => {
      if(!data) return;
      this.studyZone = data;
      this.studyZone.episodes.forEach((episode,index) => {
        const date = new Date(episode.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const term = this.terms.find(term => term.year === year && term.month === month);
        if(term){
          episode.id = index
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

    // Observa los cambios en el episodio seleccionado, si cambia marca el episodio activo en la barra de episodios y desplaza el slider si es necesario
    this.studyZoneService.episode.subscribe(episode => {
      this.episode = episode;
      setTimeout(() => {
        this.activeBarEpisode = document.querySelector('.active') as HTMLElement;
        this.showElementOnSlider(this.activeBarEpisode);
      },0);
    });

    // Observa los cambios en el episodio previsualizado, si cambia marca el episodio previsualizado en la barra de episodios
    this.studyZoneService.previewEpisode.subscribe(episode => {
      this.episodePreview = episode;
      this.previewBarEpisode = document.querySelector('.preview') as HTMLElement;
    });

  }

  /*
    * @description: Método que se ejecuta al inicializar el componente
    * Obtiene el ancho del elemento que contiene las barras de episodios en el timeline
    * @returns void
  */
  ngAfterViewInit() {
    setTimeout(() => {
      this.getGalleryElementWidth();
    })
  }

  /*
    * @description: Calcula el alto de la barra de episodios en el timeline
    * @param StyleHeight: string
  */
  public getHeightByInconvenience(inconvenience: number): string {
    return `height: calc(${inconvenience}% - 2px)`;
  }

  /*
    * @description: Método que se ejecuta al hacer click sobre un episodio del timeline
    * Cambia el episodio seleccionado en el servicio de StudyZone y este se refleja en el modal y el mapa
    * @param event: Event
    * @param id: number
    * @returns void
  */
  public selectEpisode(event: Event, id: number): void {
    this.hidePreviewEpisode();
    this.studyZoneService.previewEpisode = null;
    this.studyZoneService.previewObservation = null;
    this.studyZoneService.observation = null;
    if(this.episode !== this.studyZone?.episodes[id]){
      if(this.studyZone?.episodes[id]){
        this.studyZoneService.episode = this.studyZone?.episodes[id];
      }
    }
  }

  /*
    * @description: Método que se ejecuta al hacer hover sobre un episodio del timeline
    * Cambia el episodio previsualizado en el servicio de StudyZone y este se refleja en el modal y el mapa
    * @param term: number
    * @param episode: number
    * @returns void
  */
  public previewEpisode(term: number, episode: number): void {

    if(this.episode !== this.terms[term].episodes[episode]){
      let selectedPreviewEpisode = this.terms[term].episodes[episode];
      this.studyZoneService.previewEpisode = selectedPreviewEpisode;
    }
    else this.hidePreviewEpisode();

  }

  /*
    * @description: Método que se ejecuta al quitar el puntero del timeline
    * Oculta el episodio previsualizado en el servicio de StudyZone y este se refleja en el modal y el mapa
  */
  public hidePreviewEpisode(): void {
    this.studyZoneService.previewEpisode = null;
  }

  /*
    * @description: Método que se ejecuta al hacer click sobre el botón de anterior en el timeline
    * Desplaza el slider hacia la izquierda
    * @returns void
  */
  public prev(){
    if(this.currentScroll > 0){
      let gallery = this.termsSlider.nativeElement as HTMLElement;
      gallery.scrollLeft = gallery.scrollLeft - this.galleryTotalWidth/2;
    }
  }

  /*
    * @description: Método que se ejecuta al hacer click sobre el botón de siguiente en el timeline
    * Desplaza el slider hacia la derecha
    * @returns void
  */
  public next(){
    if(this.currentScroll !== this.galleryTotalWidth - this.galleryElementWidth){
      let gallery = this.termsSlider.nativeElement as HTMLElement;
      gallery.scrollLeft = gallery.scrollLeft + this.galleryTotalWidth/2;
    }
  }

  /*
    * @description: Método que se ejecuta al seleccionar un episodio ya sea en el timeline o en el modal
    * Muestra el episodio seleccionado en el timeline si este no es visible por estar el episodio seleccionado fuera de la vista
  */
  private showElementOnSlider(element: HTMLElement):void {
    if(element){
      let elementWidth = element.clientWidth;
      let elementLeft = element.offsetLeft + (element.parentElement ? element.parentElement?.offsetLeft : 0);
      let gallery = this.termsSlider.nativeElement as HTMLElement;
      let galleryWidth = gallery.clientWidth - elementWidth;
      let galleryScroll = gallery.scrollLeft;
      let galleryRight = galleryScroll + galleryWidth;
      if(elementLeft < galleryScroll + 10){
        gallery.scrollLeft = elementLeft - 10;
      }
      else if(elementLeft > galleryRight - 35){
        gallery.scrollLeft = elementLeft - (galleryWidth - 35);
      }
    }
  }

  /*
    * @description: Método que se ejecuta al hacer click sobre el botón de siguiente o anterior en el timeline
    * Obtiene el ancho del elemento que contiene las barras de episodios en el timeline
    * @returns void
  */
  private getGalleryElementWidth():void {
    this.galleryTotalWidth = this.termsSlider.nativeElement.clientWidth;
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    termsSlider.addEventListener('scroll', () => {
      this.currentScroll = termsSlider.scrollLeft;
    });
  }

  /*
    * @description: Método que se ejecuta al redimensionar la ventana
    * Obtiene el ancho del elemento que contiene las barras de episodios en el timeline
    * Desplaza el slider si es necesario
    * @returns void
  */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.getGalleryElementWidth();
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    this.currentScroll = this.galleryElementWidth * this.currentElement;
    termsSlider.scrollLeft = this.currentScroll;
    this.showElementOnSlider(this.activeBarEpisode);
  }

  /*
    * @description: Método que se ejecuta al destruir el componente
    * Desuscribe los observables
    * @returns void
  */
  ngOnDestroy() {
    this.studyZone$?.unsubscribe();
    this.episode$?.unsubscribe();
    this.episodePreview$?.unsubscribe();
  }

}
