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

@NgModule({
  declarations: [
    RegistersPageComponent,
    RegistersMapComponent
  ],
  imports: [
    RegistersRoutingModule,
    CommonModule,
    NgxMapboxGLModule,
    ButtonModule,
    SplitButtonModule,
    TooltipModule,
    AccordionModule,
    SidebarModule,
    OverlayPanelModule,
    TagModule
  ]
})
export class RegistersModule { }
