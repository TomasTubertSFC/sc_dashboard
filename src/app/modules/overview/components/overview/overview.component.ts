import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../../../../services/pdf/pdf.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements AfterViewInit  {
  @ViewChild('dataToExport', { static: false }) dataToExport!: ElementRef;

  constructor(private pdfService: PdfService) {}

  ngAfterViewInit(): void {
    this.pdfService.elementToPdfRef.next(this.dataToExport);
  }
}
