import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IconModule } from './icons/icons.module';
import { StudyZoneSelectModalComponent } from './components/modals/study-zone-select-modal/study-zone-select-modal.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [StudyZoneSelectModalComponent, SpinnerComponent],
  exports: [IconModule, StudyZoneSelectModalComponent, SpinnerComponent],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    HttpClientModule,
    IconModule,
  ],
})
export class SharedComponentsModule {}
