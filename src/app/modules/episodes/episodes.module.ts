import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodesPageComponent } from './episodes-page/episodes-page.component';
import { EpisodesMapComponent } from './components/episodes-map/episodes-map.component';
import { EpisodesTimelineComponent } from './components/episodes-timeline/episodes-timeline.component';
import { EpisodesRoutingModule } from './episodes-routing.module';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';



@NgModule({
  declarations: [
    EpisodesPageComponent,
    EpisodesMapComponent,
    EpisodesTimelineComponent
  ],
  exports:[
    EpisodesPageComponent,
    EpisodesMapComponent,
    EpisodesTimelineComponent
  ],
  imports: [
    ButtonModule,
    SplitButtonModule,
    CommonModule,
    EpisodesRoutingModule
  ]
})
export class EpisodesModule { }
