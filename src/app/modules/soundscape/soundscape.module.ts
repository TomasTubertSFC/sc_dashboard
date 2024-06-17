import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button'

import { SoundscapeComponent } from './page/soundscape.component';
import { SharedComponentsModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    SoundscapeComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    ButtonModule
  ]
})
export class SoundscapeModule { }
