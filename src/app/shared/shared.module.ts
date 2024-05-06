import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IconModule } from './icons/icons.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [ SpinnerComponent],
  exports: [IconModule,  SpinnerComponent],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    HttpClientModule,
    IconModule,
  ],
})
export class SharedComponentsModule {}
