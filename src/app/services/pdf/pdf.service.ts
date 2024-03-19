import { ElementRef, Injectable, WritableSignal, signal } from '@angular/core';
import jsPDF from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface reportElements {
  0: ElementRef;
  1: ElementRef;
  2: ElementRef;
  3: ElementRef;
  4: ElementRef;
}
interface reportImages {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  elementToPdfRef: BehaviorSubject<ElementRef | null> =
    new BehaviorSubject<ElementRef | null>(null);

  reportsElements: BehaviorSubject<reportElements | {}> = new BehaviorSubject<
    reportElements | {}
  >({ 0: null, 1: null, 2: null, 3: null, 4: null });

  reportsElementsImg: BehaviorSubject<reportImages | {}> = new BehaviorSubject<
    reportImages | {}
  >({ 0: null, 1: null, 2: null, 3: null, 4: null });

  constructor() {
    this.loading.subscribe((res) => {
      console.log('loading...', res);
    });
  }

  public async saveView() {
    try {
      this.loading.next(true);

      const elements = Object.values(this.reportsElements.getValue());

      const arrOfPromises = Object.values(elements).map(async (element) => {
        if (element) {
          const url = await this.elementToImgUrl(element);
          return url;
        }
        return null;
      });

      await Promise.all(arrOfPromises).then((res) => {
        res.forEach((url, idx) => {
          if (!url) return;
          this.reportsElementsImg.next({
            ...this.reportsElementsImg.getValue(),
            [idx]: url,
          });
        });
      });
      this.loading.next(false);
    } catch (err) {
      this.loading.next(false);
      console.log('err', err);
    }
  }

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

  private async elementToImgUrl(e: ElementRef): Promise<string | null> {
    try {
      const element = e.nativeElement;
      console.log('element', element);
      const canvas = await html2canvas(element, {
        logging: false,
        backgroundColor: null,
        useCORS: true,
      });
      return canvas.toDataURL();
    } catch (err) {
      console.error('err', err);
      return null;
    }
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
      const imgElement = new Image();

      imgElement.src = canvas.toDataURL();
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
      pdf.addImage(imgElement, 'PNG', 25, 185, width, height);
      pdf.save('file_name' + '.pdf');
    } catch (err) {
      console.error('err', err);
    }
  }
}
