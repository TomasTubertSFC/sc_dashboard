import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  visible: boolean = false;
  loading: boolean = false;

  company_icons: { src: string; alt: string; id: number }[] = [
    {
      src: '../assets/images/logo-sfc.png',
      alt: 'icono Science for change',
      id: 1,
    },
    {
      src: '../assets/images/cdti_min.jpg',
      alt: 'NEOTEC',
      id: 2,
    },
    {
      src: '../assets/images/NextGeneration.webp',
      alt: 'Next Generation EU',
      id: 3,
    },
  ];

  reviews: { name: string; company: string; comment: string; img: string }[] = [
    {
      name: 'Javier',
      company: 'Google',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      img: '../assets/images/icon-fecyt.png',
    },
    {
      name: 'Maria',
      company: 'Ajuntament de Barcelona',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      img: '../assets/images/icon-fecyt.png',
    },
    {
      name: 'Carmen',
      company: 'Ajuntament de Badalona',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      img: '../assets/images/icon-fecyt.png',
    },
  ];

  map_points: { top: string; left: string; id: number }[] = [
    {
      top: '14%',
      left: '4%',
      id: 1,
    },
    {
      top: '23%',
      left: '14%',
      id: 2,
    },
    {
      top: '65%',
      left: '52%',
      id: 3,
    },
    {
      top: '43%',
      left: '67%',
      id: 4,
    },
    {
      top: '49%',
      left: '20%',
      id: 5,
    },
    {
      top: '4%',
      left: '20%',
      id: 6,
    },
    {
      top: '22%',
      left: '64%',
      id: 7,
    },
    {
      top: '74%',
      left: '30%',
      id: 8,
    },
    {
      top: '36%',
      left: '46%',
      id: 9,
    },
    {
      top: '29%',
      left: '84%',
      id: 10,
    },
    {
      top: '78%',
      left: '86%',
      id: 11,
    },
  ];

  showDialog() {
    this.visible = true;
  }
  closeDialog() {
    this.visible = false;
  }

  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submit() {
    this.loading = true;
    const { name, company, email } = this.contactForm.value;
    this.loading = false;
  }
}
