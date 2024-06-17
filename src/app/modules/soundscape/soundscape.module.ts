import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoundscapeComponent } from './page/soundscape.component';
import { SharedComponentsModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    SoundscapeComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SharedComponentsModule,
  ]
})
export class SoundscapeModule { }
