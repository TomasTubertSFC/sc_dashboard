import { Component, ElementRef, ViewChild } from '@angular/core';
import { PdfService } from '../../../services/pdf/pdf.service';

@Component({
  selector: 'app-episodes-page',
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.scss',
})
export class EpisodesPageComponent {
  @ViewChild('dataToExport', { static: false }) dataToExport!: ElementRef;

  constructor(private pdfService: PdfService) {}

  ngAfterViewInit(): void {
    this.pdfService.elementToPdfRef.next(this.dataToExport);
  }
}
