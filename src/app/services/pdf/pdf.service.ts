import { ElementRef, Injectable } from '@angular/core';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { MapComponent } from 'ngx-mapbox-gl';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  elementToPdfRef: BehaviorSubject<ElementRef | null> =
    new BehaviorSubject<ElementRef | null>(null);

  mapToPdfRef: BehaviorSubject<MapComponent | null> =
    new BehaviorSubject<MapComponent | null>(null);

  constructor() {}

  private boxGardient() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a linear gradient
    const linearGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    linearGradient.addColorStop(0, '#d7b1f2');
    linearGradient.addColorStop(1, '#ff6200');

    // Create a radial gradient
    const radialGradient = ctx.createRadialGradient(
      canvas.width * 0.7736,
      canvas.height * 0.5752,
      0,
      canvas.width * 0.7736,
      canvas.height * 0.5752,
      canvas.width * 0.7736
    );
    radialGradient.addColorStop(0, '#ff6200');
    radialGradient.addColorStop(1, '#d7b1f2');

    // Draw the linear gradient
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the radial gradient on top of the linear gradient
    // ctx.fillStyle = radialGradient;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL
    const gradientImageUrl = canvas.toDataURL('image/jpeg');

    return gradientImageUrl;
  }

  public async downloadAsPdf() {
    try {
      const element = this.elementToPdfRef.getValue()?.nativeElement;
      const ocLogo = document.querySelector('icon-odour-logo');

      const canvas = await html2canvas(element, { logging: false });
      const logoOcCanvas = await html2canvas(ocLogo as HTMLElement, {
        logging: false,
        backgroundColor: null,
      });
      const imgLogo = new Image();
      const imgMap = new Image();

      imgMap.src = canvas.toDataURL();
      imgLogo.src = logoOcCanvas.toDataURL();

      const width = element.clientWidth;
      const height = element.clientHeight + element.clientHeight * 0.1;

      let orientation = '';
      const imageUnit = 'pt';
      if (width > height) {
        orientation = 'l';
      } else {
        orientation = 'p';
      }

      let jsPdfOptions = {
        orientation: orientation as 'l' | 'p',
        unit: imageUnit as 'pt' | 'mm' | 'cm' | 'in',
        format: [width + 50, height + 320],
      };
      const pdf = new jsPDF(jsPdfOptions);

      const box = this.boxGardient();

      //Layout
      pdf.addImage(
        box as string,
        'JPEG',
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        150
      );
      pdf.addImage(
        box as string,
        'JPEG',
        0,
        pdf.internal.pageSize.getHeight() - 25,
        pdf.internal.pageSize.getWidth(),
        25
      );

      //Logo
      pdf.addImage(imgLogo, 'PNG', width - 125, 25, 144.1, 110);

      //Informe titulo
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor('#fff');
      pdf.text('OdourCollect Report', 25, 75);

      //Fecha
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(28);
      pdf.setTextColor('#fff');
      pdf.text(moment().format('ll'), 25, 115);

      //Imagen del informe descargado
      pdf.addImage(imgMap, 'PNG', 25, 185, width, height);
      pdf.save('file_name' + '.pdf');
    } catch (err) {
      console.error('err', err);
    }
  }
}
