import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../services/auth/auth.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {
  valCheck: string[] = ['remember'];

  password!: string;

  loading: boolean = false;

  recoverPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.authService.isLoggedIn.value && this.router.navigate(['/']);
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Correo enviado',
      detail:
        'Comprueba tu bandeja de entrada o spam para recuperar tu contraseña',
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Error',
      detail: 'El email es incorrecto',
    });
  }

  clear() {
    this.messageService.clear();
  }

  submit() {
    // this.user = {
    //   email: this.loginForm.value.email,
    //   password: this.loginForm.value.password,
    // };

    this.loading = true;

    this.authService
      .recoverPasswordEmail(this.recoverPasswordForm.value.email)
      .subscribe({
        next: () => {
          this.showSuccess();
          this.loading = false;
        },
        error: (resp: any) => {
          if (resp.status == 422) {
            this.recoverPasswordForm.controls['email'].markAsUntouched();
            this.clear();
            this.showWarn();
          }
          this.loading = false;
        },
      });
  }
}
