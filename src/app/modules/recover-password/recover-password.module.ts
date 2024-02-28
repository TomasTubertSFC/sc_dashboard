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
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { CreatePasswordComponent } from './components/create-password/create-password.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
    InputGroupModule,
    InputGroupAddonModule,
  ],
  declarations: [RecoverPasswordComponent, CreatePasswordComponent],
})
export class RecoverPasswordModule {}
