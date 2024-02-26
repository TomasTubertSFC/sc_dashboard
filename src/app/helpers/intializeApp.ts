import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { APP_INITIALIZER } from '@angular/core';

function initializeAppFactory(
  authService: AuthService
): () => Observable<boolean | { status: number; data: any }> {
  return () => authService.userIsLogged();
}

export const initializeInterceptorProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  deps: [AuthService],
  multi: true,
};
