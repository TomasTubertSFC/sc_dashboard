import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './page/overview/overview.component';
import { CatalunyaMapComponent } from './components/catalunya-map/catalunya-map.component';

@NgModule({
  declarations: [OverviewComponent, CatalunyaMapComponent],
  imports: [
    CommonModule
  ]
})
export class OverviewModule { }
