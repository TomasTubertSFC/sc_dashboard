import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { RecoverPasswordComponent } from './recover-password.component';

@NgModule({
  imports: [
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    ToastModule,
  ],
  declarations: [RecoverPasswordComponent],
})
export class RecoverPasswordModule {}
