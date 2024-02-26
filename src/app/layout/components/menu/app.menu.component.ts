import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.model = [
      {
        label: '',
        items: [
          { label: 'Resumen', icon: '', routerLink: ['/'] },
          { label: 'Episodios de olor', icon: '', routerLink: ['/episodios'] },
          { label: 'Registros de olor', icon: '', routerLink: ['/registros'] },
          {
            label: 'Informes',
            icon: '',
            command: () => {
              console.log('command');
            },
          },
          {
            label: 'Descargar CSV',
            icon: '',
            command: () => {
              console.log('command');
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
}
