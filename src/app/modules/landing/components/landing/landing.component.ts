import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  company_icons: { src: string; alt: string; id: number }[] = [
    {
      src: '../assets/images/icon-fecyt.png',
      alt: 'icono Fecyt',
      id: 1,
    },
    {
      src: '../assets/images/logo-ministerio-innovacion.svg',
      alt: 'ministerio de innovación',
      id: 2,
    },
  ];
}
