import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';

import { SoundscapeComponent } from './page/soundscape.component';
import { SharedComponentsModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SoundLevelsChartComponent } from './components/sound-levels-chart/sound-levels-chart.component';
import { SoundTypesChartComponent } from './components/sound-types-chart/sound-types-chart.component';
import { QuasChartComponent } from './components/quas-chart/quas-chart.component';
import { PerceptionChartComponent } from './components/perception-chart/perception-chart.component';
import { PressureChartComponent } from './components/pressure-chart/pressure-chart.component';
import { QualitativeDataChartComponent } from './components/qualitative-data-chart/qualitative-data-chart.component';



@NgModule({
  declarations: [
    SoundscapeComponent,
    SoundLevelsChartComponent,
    SoundTypesChartComponent,
    QuasChartComponent,
    PerceptionChartComponent,
    PressureChartComponent,
    QualitativeDataChartComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SharedComponentsModule,
    SelectButtonModule,
    FormsModule
  ]
})
export class SoundscapeModule { }
