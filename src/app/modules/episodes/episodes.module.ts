import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { EpisodesRoutingModule } from './episodes-routing.module';
import { EpisodesPageComponent } from './episodes-page/episodes-page.component';
import { EpisodesMapComponent } from './components/episodes-map/episodes-map.component';
import { EpisodesTimelineComponent } from './components/episodes-timeline/episodes-timeline.component';
import { EpisodesModalComponent } from './components/episodes-modal/episodes-modal.component';
import { SidebarModule } from 'primeng/sidebar';
import { EpisodesMapConeComponent } from './components/episodes-map/components/episodes-map-cone/episodes-map-cone.component';

@NgModule({
  declarations: [
    EpisodesPageComponent,
    EpisodesMapComponent,
    EpisodesTimelineComponent,
    EpisodesModalComponent,
    EpisodesMapConeComponent,
  ],
  exports:[
    EpisodesPageComponent,
    EpisodesMapComponent,
    EpisodesTimelineComponent,
    EpisodesModalComponent,
    EpisodesMapConeComponent,
  ],
  imports: [
    ButtonModule,
    SplitButtonModule,
    SidebarModule,
    CommonModule,
    EpisodesRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoibmV0aWZpZzM1MiIsImEiOiJjbHN4Yzcyc3AwMW8xMmtwMnVlenEyaGQ0In0.SMd509FY7jcvLxBPpbw0pA',
    })
  ]
})
export class EpisodesModule { }
