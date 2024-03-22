import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportCardComponent } from './components/report-card/report-card.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ReportsComponent, ReportCardComponent],
  imports: [CommonModule, CheckboxModule, FormsModule, ButtonModule],
})
export class ReportsModule {}
