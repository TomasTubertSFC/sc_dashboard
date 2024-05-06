import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './page/overview.component';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    DropdownModule,
    SkeletonModule,
    PaginatorModule,
  ],
})
export class OverviewModule {}
