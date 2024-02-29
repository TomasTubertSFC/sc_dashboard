import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, ButtonModule, CarouselModule],
})
export class LandingModule {}
