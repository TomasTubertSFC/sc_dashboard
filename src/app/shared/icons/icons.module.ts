import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OdourLogoComponent } from './odour-logo/odour-logo.component';
import { OdourCollectComponent } from './odour-icon/odour-icon.component';
import { AddToChartComponent } from './add-to-chart/add-to-chart.component';
import { ChangeCircleComponent } from './change-circle/change-circle.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { RubricComponent } from './rubric/rubric.component';
import { OdourRegistersComponent } from './odour-registers/odour-registers.components';
import { TransitionFadeComponent } from './transition-fade/transition-fade.components';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { OdourIconLogoComponent } from './odour-icon-logo/odour-icon-logo.component';
import { UserIconComponent } from './user-icon/user-icon.components';
import { LogoutIconComponent } from './logout-icon/logout-icon.components';
import { DownloadIconComponent } from './download/download.components';

@NgModule({
  declarations: [
    OdourLogoComponent,
    OdourCollectComponent,
    AddToChartComponent,
    ChangeCircleComponent,
    DateRangeComponent,
    RubricComponent,
    OdourRegistersComponent,
    TransitionFadeComponent,
    BarChartComponent,
    OdourIconLogoComponent,
    UserIconComponent,
    LogoutIconComponent,
    DownloadIconComponent,
  ],
  exports: [
    OdourLogoComponent,
    OdourCollectComponent,
    AddToChartComponent,
    ChangeCircleComponent,
    DateRangeComponent,
    RubricComponent,
    OdourRegistersComponent,
    TransitionFadeComponent,
    BarChartComponent,
    OdourIconLogoComponent,
    UserIconComponent,
    LogoutIconComponent,
    DownloadIconComponent,
  ],
  imports: [CommonModule],
})
export class IconModule {}
