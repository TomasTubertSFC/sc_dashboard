import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CarouselModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    RippleModule,
  ],
})
export class LandingModule {}
