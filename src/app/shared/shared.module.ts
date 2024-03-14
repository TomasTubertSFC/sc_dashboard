import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IconModule } from './icons/icons.module';
import { StudyZoneSelectModalComponent } from './components/modals/study-zone-select-modal/study-zone-select-modal.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    StudyZoneSelectModalComponent
  ],
  exports: [
    IconModule,
    StudyZoneSelectModalComponent
  ],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    HttpClientModule,
    IconModule
  ],
})
export class SharedComponentsModule {}
