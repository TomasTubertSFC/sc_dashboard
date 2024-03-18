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
import { FormsModule } from '@angular/forms';
import { RegistersFilterModalComponent } from './components/registers-filter-modal/registers-filter-modal.component';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    RegistersPageComponent,
    RegistersMapComponent,
    RegistersFilterModalComponent
  ],
  imports: [
    FormsModule,
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
    CalendarModule

  ]
})
export class RegistersModule { }
