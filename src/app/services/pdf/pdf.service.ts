import { ElementRef, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';

interface reportElements {
  0: ElementRef;
  1: ElementRef;
  2: ElementRef;
  3: ElementRef;
  4: ElementRef;
  5: ElementRef;
  6: ElementRef;
}
interface reportImages {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  reportsElements: BehaviorSubject<reportElements | {}> = new BehaviorSubject<
    reportElements | {}
  >({ 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });

  reportsElementsImg: BehaviorSubject<reportImages | {}> = new BehaviorSubject<
    reportImages | {}
  >({ 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });

  constructor(private messageService: MessageService) {}

  public async saveView() {
    this.loading.next(true);
    try {
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
      this.messageService.add({
        severity: 'success',
        summary: '¡Guardados!',
        detail: 'Gráficos añadidos a informes con éxito!',
      });
    } catch (err) {
      this.loading.next(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Los gráficos no se han podido añadir al informe. Inténtelo de nuevo.',
      });
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
    linearGradient.addColorStop(0.75, '#ff6200');

    // Draw the linear gradient
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL
    const gradientImageUrl = canvas.toDataURL('image/jpeg');

    return gradientImageUrl;
  }

  private async elementToImgUrl(e: ElementRef): Promise<string | null> {
    try {
      const element = e.nativeElement;
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

  private async addPageLayoutStyle(pdf: jsPDF): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const resizeLogo = 0.5;

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        const totalPages = pdf.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          const imgLogo = new Image();

          imgLogo.src = 'assets/images/Logo-odourCollect.png';
          imgLogo.style.objectFit = 'contain';

          const box = this.boxGardient();

          //Layout
          pdf.addImage(box as string, 'JPEG', 0, 0, width, 75);
          pdf.addImage(box as string, 'JPEG', 0, height - 25, width, 25);

          //Logo
          pdf.addImage(
            imgLogo,
            'PNG',
            width - 100,
            10,
            144.1 * resizeLogo,
            110 * resizeLogo
          );

          //Title
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(24);
          pdf.setTextColor('#fff');
          pdf.text('OdourCollect Report', 25, 40);

          //Date
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(20);
          pdf.setTextColor('#fff');
          pdf.text(moment().format('ll'), 25, 60);
        }

        resolve();
      } catch (err) {
        console.error('err', err);
        this.loading.next(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El informe no se ha podido descargar. Inténtelo de nuevo.',
        });
      }
    });
  }

  public async downloadAsPdf(
    elementsToPdf: { value: string | null; key: string }[]
  ) {
    this.loading.next(true);
    try {
      const elementsSelected = elementsToPdf.map((el) => Number(el.key));

      const firstPage = elementsSelected.filter((el) => el < 3);
      const restPages = elementsSelected
        .filter((el) => el >= 3)
        .map((el) => [el]);
      const pages = [firstPage, ...restPages];

      const pdf = new jsPDF('l', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const createPagesPromises = pages.map(async (page, idx) => {
        return new Promise<void>(async (resolve, reject) => {
          if (!page.length) return resolve();

          //Create section for the graphs
          const section = document.createElement('section');
          section.style.display = 'flex';
          section.style.justifyContent = 'center';
          section.style.alignItems = 'flex-end';
          section.style.alignContent = 'center';
          section.style.gap = '5px';
          section.style.flexWrap = 'wrap';
          section.style.width = '841.89px';
          section.style.height = '495.28px';
          section.id = `sectionToPdf-${idx}`;

          if (idx === 0) {
            pages[0].forEach((elementNum, idx) => {
              const img = document.createElement('img');
              const div = document.createElement('div');
              const graph = elementsToPdf.find(
                (el) => Number(el.key) === elementNum
              );
              img.src = graph?.value as string;
              const moreThanOneGraph = pages[0].length > 1;
              if (moreThanOneGraph) {
                img.style.objectFit = 'contain';
                img.style.width = '100%';
                switch (idx) {
                  case 0:
                    div.style.width = '100%';
                    div.style.textAlign = 'center';
                    img.style.maxWidth = '490px';
                    img.style.maxHeight = '365px';
                    break;
                  case 1:
                    img.style.maxWidth = '465px';
                    img.style.maxHeight = '120px';
                    break;
                  case 2:
                    img.style.maxWidth = '345px';
                    img.style.maxHeight = '120px';
                    break;
                }
              } else {
                img.style.maxHeight = '490px';
              }
              div.appendChild(img);
              section.appendChild(div);
            });
          } else {
            page.forEach((elementNum, idx) => {
              const graph = elementsToPdf.find(
                (el) => Number(el.key) === elementNum
              );
              const img = document.createElement('img');
              const div = document.createElement('div');
              img.src = graph?.value as string;
              img.style.objectFit = 'contain';
              img.style.width = '100%';
              img.style.maxHeight = '490px';
              div.appendChild(img);
              section.appendChild(div);
            });
          }
          //Add section/page to dom
          document.body.appendChild(section);

          const sectionToCanvas = document.getElementById(
            `sectionToPdf-${idx}`
          );

          const elementToCanvas = await html2canvas(
            sectionToCanvas as HTMLElement,
            {
              logging: false,
              backgroundColor: null,
              useCORS: true,
            }
          );

          if (sectionToCanvas && sectionToCanvas.parentNode) {
            sectionToCanvas.parentNode.removeChild(sectionToCanvas);
          }

          const imagePromise: () => Promise<{
            img: HTMLImageElement;
            widthImg: number;
            heightImg: number;
          }> = () => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () =>
                resolve({ img, widthImg: img.width, heightImg: img.height });
              img.onerror = reject;
              img.src = elementToCanvas.toDataURL();
            });
          };

          // Wait for the image to load
          const image = await imagePromise();

          //La altura que le resto
          const substratingValue = 125;

          // Calculate scale factors
          const widthScale = (pageWidth - 50) / image.widthImg;
          const heightScale = (pageHeight - substratingValue) / image.heightImg;

          // Use the smaller scale factor to ensure the image fits without stretching
          const scale = Math.min(widthScale, heightScale);

          // Calculate the dimensions of the image after scaling
          const widthToPaint = image.widthImg * scale;
          const heightToPaint = image.heightImg * scale;

          const Xstart = (pageWidth - widthToPaint) / 2;
          const Ystart = (pageHeight - heightToPaint - 100) / 2 + 75;

          const pagesToCreate = pages.filter((page) => page.length > 0);

          //Check if the first page is not the first page to create
          if (idx > 0 && pagesToCreate[0] !== page) {
            pdf.addPage();
          }

          pdf.addImage(
            image.img,
            'PNG',
            Xstart,
            Ystart,
            widthToPaint,
            heightToPaint
          );
          resolve();
        });
      });

      await Promise.all(createPagesPromises);
      await this.addPageLayoutStyle(pdf);
      const date = new Date().toLocaleDateString('es-ES');

      pdf.save('OC_Report_' + date + '.pdf');
      this.loading.next(false);
      this.messageService.add({
        severity: 'success',
        summary: '¡Descargado!',
        detail: 'Informe descargado con éxito!',
      });
    } catch (err) {
      this.loading.next(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El informe no se ha podido descargar. Inténtelo de nuevo.',
      });
      console.error('err', err);
    }
  }
}
