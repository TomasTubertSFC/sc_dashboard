import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

import { SoundscapeComponent } from './page/soundscape.component';
import { SharedComponentsModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SoundLevelsChartComponent } from './components/sound-levels-chart/sound-levels-chart.component';
import { SoundTypesChartComponent } from './components/sound-types-chart/sound-types-chart.component';
import { QuasChartComponent } from './components/quas-chart/quas-chart.component';



@NgModule({
  declarations: [
    SoundscapeComponent,
    SoundLevelsChartComponent,
    SoundTypesChartComponent,
    QuasChartComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SharedComponentsModule,
    FormsModule
  ]
})
export class SoundscapeModule { }
