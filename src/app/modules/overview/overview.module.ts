import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './page/overview/overview.component';
import { CatalunyaMapComponent } from './components/catalunya-map/catalunya-map.component';
import { ObservationNumbersComponent } from './components/observation-numbers/observation-numbers.component';
import { TableModule } from 'primeng/table';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OverviewComponent, CatalunyaMapComponent, ObservationNumbersComponent, BarChartComponent],
  imports: [
    CommonModule,
    TableModule,
    CalendarModule,
    // FormsModule,
    ReactiveFormsModule,  ]
})
export class OverviewModule { }
