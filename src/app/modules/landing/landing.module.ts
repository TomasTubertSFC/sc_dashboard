import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class LandingModule { }
