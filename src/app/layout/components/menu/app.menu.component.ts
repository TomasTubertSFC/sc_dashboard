import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { PdfService } from '../../../services/pdf/pdf.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(
    private authService: AuthService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.model = [
      {
        label: '',
        items: [
          { label: 'Resumen', icon: '', routerLink: ['/dashboard'] },
          {
            label: 'Episodios de olor',
            icon: '',
            routerLink: ['/dashboard/episodes'],
          },
          {
            label: 'Registros de olor',
            icon: '',
            routerLink: ['/dashboard/registers'],
          },
          {
            label: 'Informes',
            icon: '',
            routerLink: ['/dashboard/informes'],
          },
          {
            label: 'Descargar PDF',
            icon: '',
            command: () => {
              this.downloadAsPdf();
            },
          },
          {
            label: 'Mi perfil',
            icon: '',
            routerLink: ['/mi-perfil'],
            class: 'block md:hidden',
          },
          {
            label: 'Cerrar sesión',
            icon: '',
            command: () => {
              this.authService.logout();
            },
            class: 'block md:hidden',
          },
        ],
      },
    ];
  }

  downloadAsPdf(): void {
    this.pdfService.downloadAsPdf();
  }
}
