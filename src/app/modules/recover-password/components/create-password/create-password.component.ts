import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, Event, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../../services/auth/auth.service';

import { MessageService } from 'primeng/api';
import { confirmPasswordValidator } from '../../../../validators/confirm-password.validator';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss',
  providers: [MessageService],
})
export class CreatePasswordComponent {
  valCheck: string[] = ['remember'];

  password!: string;

  loading: boolean = false;

  private token!: string | null;
  private email!: string | null;

  newPasswordForm: FormGroup = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirmation: new FormControl('', [
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
      detail: 'Error al cambiar la contraseña, intenta de nuevo.',
    });
  }

  clear() {
    this.messageService.clear();
  }

  submit() {
    const passwords = {
      password: this.newPasswordForm.value.password!,
      password_confirmation: this.newPasswordForm.value.password_confirmation!,
      token: this.token,
      email: this.email,
    };

    this.loading = true;

    this.authService.postCreatePasswords(passwords).subscribe({
      next: () => {
        this.showSuccess();
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (resp) => {
        if (resp.status == 422) {
          this.showWarn();
          Object.keys(resp.error.errors)
            .map((key) => key)
            .forEach((field) => {
              let errors: { [error: string]: true } = resp.error.errors[
                field
              ].reduce((acc: any, error: string) => {
                acc[error] = true;
                return acc;
              }, {});
              this.newPasswordForm.controls[field].setErrors(errors);
              this.newPasswordForm.controls[field].markAsTouched();
            });
        }
        this.loading = false;
      },
    });
  }
}
