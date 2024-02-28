import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IconModule } from './icons/icons.module';

@NgModule({
  declarations: [],
  exports: [IconModule],
  imports: [CommonModule, HttpClientModule, IconModule],
})
export class SharedComponentsModule {}
