import { Component } from '@angular/core';
import { PdfService } from '../../../../services/pdf/pdf.service';

interface imgElements {
  key: string;
  value: null | string;
  checked: boolean;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  imgElements!: imgElements[];

  constructor(private pdfService: PdfService) {
    const imgElements = this.pdfService.reportsElementsImg.getValue();
    const imgElementsArr = Object.entries(imgElements)
      .map(([key, value]) => ({
        key,
        value,
        checked: true,
      }))
      .filter(({ value }) => value);

    this.imgElements = imgElementsArr;
  }

  async downloadReport() {
    try {
      const downloadReports = this.imgElements
        .filter((el) => el.checked)
        .map(({ value, key }) => {
          return {
            value,
            key,
          };
        });
      this.pdfService.downloadAsPdf(downloadReports);
    } catch (e) {
      console.error(e);
    }
  }
}
