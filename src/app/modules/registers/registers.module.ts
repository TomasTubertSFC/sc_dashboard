import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersPageComponent } from './registers-page/registers-page.component';
import { RegistersMapComponent } from './components/registers-map/registers-map.component';
import { RegistersRoutingModule } from './registers-routing.module';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistersFilterModalComponent } from './components/registers-filter-modal/registers-filter-modal.component';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { RegistersTimeChartsComponent } from './components/registers-time-charts/registers-time-charts.component';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RegistersTypologyChartsComponent } from './components/registers-typology-charts/registers-typology-charts.component';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [
    RegistersPageComponent,
    RegistersMapComponent,
    RegistersFilterModalComponent,
    RegistersTimeChartsComponent,
    RegistersTypologyChartsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RegistersRoutingModule,
    CommonModule,
    NgxMapboxGLModule,
    ButtonModule,
    TooltipModule,
    SidebarModule,
    OverlayPanelModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule,
    SliderModule,
    CalendarModule,
    ChartModule,
    DividerModule,
    RadioButtonModule,
    SkeletonModule,

  ]
})
export class RegistersModule { }
