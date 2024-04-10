import { Component, ElementRef, ViewChild } from '@angular/core';
import { PdfService } from '../../../services/pdf/pdf.service';

@Component({
  selector: 'app-episodes-page',
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.scss',
})
export class EpisodesPageComponent {
  @ViewChild('episodesMap', { static: false }) episodesMap!: ElementRef;

  public episodesSidebarVisible: boolean = false;

  constructor(private pdfService: PdfService) {}

  ngAfterViewInit(): void {
    const reportsElements = this.pdfService.reportsElements.getValue();

    this.pdfService.reportsElements.next({
      ...reportsElements,
      3: this.episodesMap,
    });
  }
  public isModalOpened(open:boolean) {
    this.episodesSidebarVisible = open;
  }
}
