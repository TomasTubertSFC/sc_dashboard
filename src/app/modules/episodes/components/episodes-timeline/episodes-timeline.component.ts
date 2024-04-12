import { HttpClient } from '@angular/common/http';
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

  constructor(private studyZoneService: StudyZoneService) { }

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
    this.studyZoneService.episode.subscribe(episode => {
      this.episode = episode;
      setTimeout(() => {
        this.activeBarEpisode = document.querySelector('.active') as HTMLElement;
        this.showElementOnSlider(this.activeBarEpisode);
      },0);
    });
    this.studyZoneService.previewEpisode.subscribe(episode => {
      this.episodePreview = episode;
      this.previewBarEpisode = document.querySelector('.preview') as HTMLElement;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getGalleryElementWidth();
    })
  }

  public getHeightByInconvenience(inconvenience: number): string {
    return `height: calc(${ Math.round((inconvenience *100)/7) }% - 2px)`;
  }

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

  public previewEpisode(term: number, episode: number): void {

    if(this.episode !== this.terms[term].episodes[episode]){
      let selectedPreviewEpisode = this.terms[term].episodes[episode];
      this.studyZoneService.previewEpisode = selectedPreviewEpisode;
    }
    else this.hidePreviewEpisode();

  }

  public hidePreviewEpisode(): void {
    this.studyZoneService.previewEpisode = null;
  }

  public prev(){
    if(this.currentScroll > 0){
      let gallery = this.termsSlider.nativeElement as HTMLElement;
      gallery.scrollLeft = gallery.scrollLeft - this.galleryTotalWidth/2;
    }
  }

  public next(){
    if(this.currentScroll !== this.galleryTotalWidth - this.galleryElementWidth){
      let gallery = this.termsSlider.nativeElement as HTMLElement;
      gallery.scrollLeft = gallery.scrollLeft + this.galleryTotalWidth/2;
    }
  }

  private showElementOnSlider(element: HTMLElement){
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

  private getGalleryElementWidth(){
    this.galleryTotalWidth = this.termsSlider.nativeElement.clientWidth;
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    termsSlider.addEventListener('scroll', () => {
      this.currentScroll = termsSlider.scrollLeft;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.getGalleryElementWidth();
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    this.currentScroll = this.galleryElementWidth * this.currentElement;
    termsSlider.scrollLeft = this.currentScroll;
    this.showElementOnSlider(this.activeBarEpisode);
  }

  ngOnDestroy() {
    this.studyZone$?.unsubscribe();
    this.episode$?.unsubscribe();
    this.episodePreview$?.unsubscribe();
  }

}
