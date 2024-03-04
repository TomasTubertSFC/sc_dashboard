import { ElementRef, Injectable } from '@angular/core';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';
import moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  elementToPdfRef: BehaviorSubject<ElementRef | null> =
    new BehaviorSubject<ElementRef | null>(null);

  pdfName: string = 'test';
  constructor() {}

  public downloadAsPdf(): void {
    const pdfRef = this.elementToPdfRef.getValue();
    if (!pdfRef) return;

    const width = pdfRef.nativeElement.clientWidth;
    const height =
      pdfRef.nativeElement.clientHeight +
      (pdfRef.nativeElement.clientHeight * 0.1);
    console.log('width', width);
    console.log(
      'pdfRef.nativeElement.clientHeigh',
      pdfRef.nativeElement.clientHeight
    );
    console.log('height', height);
    let orientation = '';
    const imageUnit = 'pt';
    if (width > height) {
      orientation = 'l';
    } else {
      orientation = 'p';
    }
    domToImage
      .toPng(pdfRef.nativeElement, {
        width: width,
        height: height,
      })
      .then((result) => {
        let jsPdfOptions = {
          orientation: orientation as 'l' | 'p',
          unit: imageUnit as 'pt' | 'mm' | 'cm' | 'in',
          format: [width + 50, height + 220],
        };
        const pdf = new jsPDF(jsPdfOptions);
        pdf.setFontSize(48);
        pdf.setTextColor('#2585fe');
        pdf.text(
          this.pdfName
            ? this.pdfName.toUpperCase()
            : 'Untitled dashboard'.toUpperCase(),
          25,
          75
        );
        pdf.setFontSize(24);
        pdf.setTextColor('#131523');
        pdf.text('Report date: ' + moment().format('ll'), 25, 115);
        pdf.addImage(result, 'PNG', 25, 185, width, height);
        pdf.save('file_name' + '.pdf');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
