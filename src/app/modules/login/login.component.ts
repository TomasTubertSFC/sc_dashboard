import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';

import { MessageService } from 'primeng/api';

export interface UserLogin {
  email: String;
  password: String;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
  providers: [MessageService],
})
export class LoginComponent {
  private user!: UserLogin;

  private lastUrl!: string | null;

  valCheck: string[] = ['remember'];

  password!: string;

  loading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.authService.isLoggedIn.value && this.router.navigate(['/']);
    
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.lastUrl = event.urlAfterRedirects;
      });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sesión iniciada',
      detail: '¡Bienvenido!',
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Error',
      detail: 'Email o contraseña son incorrectos',
    });
  }

  clear() {
    this.messageService.clear();
  }

  submit() {
    this.user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loading = true;

    this.authService.login(this.user).subscribe({
      next: () => {
        this.showSuccess();
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (resp: any) => {
        if (resp.status == 422) {
          this.loginForm.controls['email'].markAsUntouched();
          this.clear();
          this.showWarn();

          this.loginForm.controls['password'].reset();
        }
        this.loading = false;
      },
    });
  }
}
