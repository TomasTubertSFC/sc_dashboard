import { CanActivateFn, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { filter } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  console.log('authService.isLoggedIn', authService.isLoggedIn);

  if (!authService.isLoggedIn.value) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
