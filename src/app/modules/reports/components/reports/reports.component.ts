import { Component } from '@angular/core';
import { PdfService } from '../../../../services/pdf/pdf.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  constructor(private pdfService: PdfService) {}
}
