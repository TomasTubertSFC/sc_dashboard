import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../services/auth/auth.service';

import { MessageService } from 'primeng/api';
import { confirmPasswordValidator } from '../../../../validators/confirm-password.validator';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss',
})
export class CreatePasswordComponent {
  valCheck: string[] = ['remember'];

  password!: string;

  loading: boolean = false;

  showPasswords: {
    new_password: boolean;
    new_password_confirmation: boolean;
  } = {
    new_password: false,
    new_password_confirmation: false,
  };

  private token!: string | null;
  private email!: string | null;

  newPasswordForm: FormGroup = new FormGroup(
    {
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
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.isLoggedIn.value && this.router.navigate(['/']);
    this.token = this.route.snapshot.paramMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
    if (!this.token && !this.email) {
      this.router.navigate(['/login']);
    }
  }

  toggleShowPassword(field: string) {
    this.showPasswords[field as keyof typeof this.showPasswords] =
      !this.showPasswords[field as keyof typeof this.showPasswords];
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Contraseña cambiada',
      detail:
        'Tu contraseña ha sido actualizada con éxito, ahora puedes iniciar sesión.',
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Error',
      detail: 'Error al cambiar la contraseña, intentalo de nuevo.',
    });
  }

  clear() {
    this.messageService.clear();
  }

  submit() {
    const passwords = {
      password: this.newPasswordForm.value.new_password!,
      password_confirmation: this.newPasswordForm.value.new_password_confirmation!,
      token: this.token,
      email: this.email,
    };

    this.loading = true;

    this.authService.postCreatePasswords(passwords).subscribe({
      next: () => {
        this.showSuccess();
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (resp) => {
        if (resp.status == 422) {
          this.showWarn();
        }
        this.loading = false;
      },
    });
  }
}
