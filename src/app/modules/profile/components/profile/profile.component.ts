import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { confirmPasswordValidator } from '../../../../validators/confirm-password.validator';
import { UserService } from '../../../../services/user/user.service';

import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  visible: boolean = false;

  loading: boolean = false;

  showPasswords: {
    old_password: boolean;
    new_password: boolean;
    new_password_confirmation: boolean;
  } = {
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  };

  newPasswordForm: FormGroup = new FormGroup(
    {
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: [confirmPasswordValidator] }
  );

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Contraseña actualizada',
      detail: 'Tu contraseña ha sido actualizada correctamente',
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Error',
      detail: 'Error al cambiar la contraseña, intentalo de nuevo.',
    });
  }

  showDialog() {
    this.visible = true;
  }

  toggleShowPassword(field: string) {
    this.showPasswords[field as keyof typeof this.showPasswords] =
      !this.showPasswords[field as keyof typeof this.showPasswords];
  }

  submit() {
    this.loading = true;
    const passwords = { ...this.newPasswordForm.value };

    this.userService.changePassword(passwords).subscribe({
      next: () => {
        this.showSuccess();
        this.loading = false;
        setTimeout(() => {
          this.visible = false;
        },1500)
      },
      error: (resp) => {
        if (resp.status == 422) {
          this.newPasswordForm.controls['new_password'].markAsUntouched();
          this.newPasswordForm.controls['old_password'].markAsUntouched();
          this.newPasswordForm.controls[
            'new_password_confirmation'
          ].markAsUntouched();
          this.showWarn();
        }
        this.loading = false;
      },
    });
  }
}
