import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Episode, StudyZone } from '../../../../models/study-zone';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Button } from 'primeng/button';

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

  public studyZone: StudyZone | null = null;

  public episode: Episode | null = null;

  @ViewChild('termsSlider') termsSlider!: ElementRef;
  @ViewChild('nextButton') nextButton!: Button;
  @ViewChild('prevButton') prevButton!: Button;
  public currentElement:number = 1;
  public galleryElementWidth!:number;
  public galleryTotalWidth!:number;
  public currentScroll!:number;

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit() {
    this.studyZoneService.studyZone.subscribe(data => {
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
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getGalleryElementwidth();
    })
  }

  public getHeightByInconvenience(inconvenience: number): string {
    return `height: ${((inconvenience + 1) * 10)-2}px`;
  }

  public selectEpisode(event: Event, term: number, episode: number): void {
    this.hidePreviewEpisode();
    if(this.episode !== this.terms[term].episodes[episode]){
      let element = event.target as HTMLElement;
      //remover a classe active de todos os elementos
      document.querySelectorAll('.episode').forEach(element => {
        element.classList.remove('active');
      });
      element.classList.add('active');
      this.episode = this.terms[term].episodes[episode];
      this.studyZoneService.episode = this.episode;
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

  getGalleryElementwidth(){
    this.galleryTotalWidth = this.termsSlider.nativeElement.clientWidth;
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    termsSlider.addEventListener('scroll', () => {
      this.currentScroll = termsSlider.scrollLeft;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.getGalleryElementwidth();
    let termsSlider = this.termsSlider.nativeElement as HTMLElement;
    this.currentScroll = this.galleryElementWidth * this.currentElement;
    termsSlider.scrollLeft = this.currentScroll;
  }
}
