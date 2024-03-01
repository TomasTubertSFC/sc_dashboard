import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { NuisanceDegreeGraphComponent } from './components/nuisance-degree-graph/nuisance-degree-graph.component';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [OverviewComponent, NuisanceDegreeGraphComponent],
  imports: [CommonModule, ChartModule],
})
export class OverviewModule {}
