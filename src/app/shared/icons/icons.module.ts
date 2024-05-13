import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddToChartComponent } from './add-to-chart/add-to-chart.component';
import { ChangeCircleComponent } from './change-circle/change-circle.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { RubricComponent } from './rubric/rubric.component';
import { TransitionFadeComponent } from './transition-fade/transition-fade.components';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { UserIconComponent } from './user-icon/user-icon.components';
import { LogoutIconComponent } from './logout-icon/logout-icon.components';
import { DownloadIconComponent } from './download/download.components';
import { MapIconComponent } from './map/map.components';
import { SoundCollectIconComponent } from './soundcollect-icon/soundcollect-icon.components';

@NgModule({
  declarations: [
    AddToChartComponent,
    ChangeCircleComponent,
    DateRangeComponent,
    RubricComponent,
    TransitionFadeComponent,
    BarChartComponent,
    UserIconComponent,
    LogoutIconComponent,
    MapIconComponent,
    DownloadIconComponent,
    SoundCollectIconComponent
  ],
  exports: [
    AddToChartComponent,
    ChangeCircleComponent,
    DateRangeComponent,
    RubricComponent,
    TransitionFadeComponent,
    BarChartComponent,
    UserIconComponent,
    LogoutIconComponent,
    DownloadIconComponent,
    MapIconComponent,
    SoundCollectIconComponent
  ],
  imports: [CommonModule],
})
export class IconModule {}
