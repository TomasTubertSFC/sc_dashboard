import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './page/overview/overview.component';
import { CatalunyaMapComponent } from './components/catalunya-map/catalunya-map.component';
import { ObservationNumbersComponent } from './components/observation-numbers/observation-numbers.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [OverviewComponent, CatalunyaMapComponent, ObservationNumbersComponent],
  imports: [
    CommonModule,
    TableModule
  ]
})
export class OverviewModule { }
