import { OnInit, WritableSignal, signal } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../services/auth/auth.service';
import { PdfService } from '../../../services/pdf/pdf.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  disabledAddToReports!: boolean;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private pdfService: PdfService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.disabledAddToReports = event.url === '/dashboard/informes';
      });
    this.disabledAddToReports = this.router.url === '/dashboard/informes';

    this.pdfService.loading.subscribe((res) => {
      if(!res){
        this.loading = false;
      }
    })

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

  saveView(): void {
    this.loading = true;
    this.pdfService.saveView();
  }
}
