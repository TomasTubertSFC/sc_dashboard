import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersPageComponent } from './registers-page/registers-page.component';
import { RegistersMapComponent } from './components/registers-map/registers-map.component';
import { RegistersRoutingModule } from './registers-routing.module';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RegistersFilterModalComponent } from './components/registers-filter-modal/registers-filter-modal.component';

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
    SelectButtonModule,
    SplitButtonModule,
    TooltipModule,
    AccordionModule,
    SidebarModule,
    OverlayPanelModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule

  ]
})
export class RegistersModule { }
