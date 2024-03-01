import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { NuisanceDegreeGraphComponent } from './components/nuisance-degree-graph/nuisance-degree-graph.component';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ParticipantCitizenshipGraphComponent } from './components/participant-citizenship-graph/participant-citizenship-graph.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    OverviewComponent,
    NuisanceDegreeGraphComponent,
    ParticipantCitizenshipGraphComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
  ],
})
export class OverviewModule {}
