import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OdourLogoComponent } from './odour-logo/odour-logo.component';

@NgModule({
  declarations: [OdourLogoComponent],
  exports: [OdourLogoComponent],
  imports: [CommonModule],
})
export class IconModule {}
