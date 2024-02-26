import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OdourLogoComponent } from './odour-logo/odour-logo.component';
import { OdourCollectComponent } from './odour-icon/odour-icon.component';

@NgModule({
  declarations: [OdourLogoComponent, OdourCollectComponent],
  exports: [OdourLogoComponent, OdourCollectComponent],
  imports: [CommonModule],
})
export class IconModule {}
