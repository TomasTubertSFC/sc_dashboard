import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environments/environments';

export default function initializeAppFactory(
  authService: AuthService,
): () => Observable<boolean | { status: number; data: any }> {
  return () => authService.userIsLogged();
}
