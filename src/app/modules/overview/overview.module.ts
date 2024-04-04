import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { NuisanceDegreeGraphComponent } from './components/nuisance-degree-graph/nuisance-degree-graph.component';
import { ParticipantCitizenshipGraphComponent } from './components/participant-citizenship-graph/participant-citizenship-graph.component';
import { OdourEpisodeGraphComponent } from './components/odour-episode-graph/odour-episode-graph.component';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [
    OverviewComponent,
    NuisanceDegreeGraphComponent,
    ParticipantCitizenshipGraphComponent,
    OdourEpisodeGraphComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    DropdownModule,
    SkeletonModule
  ],
})
export class OverviewModule {}
