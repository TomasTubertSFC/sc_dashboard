import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { NavigationEnd, Router, Event } from '@angular/router';
import { environment } from '../../../environments/environments';

export interface RecoverPasswords {
  password: String;
  password_confirmation: String;
  token?: String | null;
  email?: String | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public lastUrl!: string | null;

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this._isLoggedIn;
  }

  set isLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }

  constructor(private http: HttpClient, private router: Router) {
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

  login(user: any): Observable<Object> {
    // return this.http
    //   .post(
    //     `${environment.BACKEND_BASE_URL}/login`,
    //     { ...user },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       withCredentials: true,
    //     }
    //   )
    //   .pipe(
    //     tap(() => {
    //       if (this.lastUrl) {
    //         this.router.navigate([this.lastUrl]);
    //         this.lastUrl = null;
    //       } else {
    //         this.router.navigate(['/dashboard']);
    //       }

    //       this._isLoggedIn.next(true);
    //     })
    //   );
    if (this.lastUrl) {
      this.router.navigate([this.lastUrl]);
      this.lastUrl = null;
    } else {
      this.router.navigate(['/dashboard']);
    }
    localStorage.setItem('_isLoggedIn', 'true');
    this._isLoggedIn.next(true);
    return of({ status: 200, data: { message: 'User logged' } });
  }

  userIsLogged(): Observable<
    | boolean
    | {
        status: number;
        data: any;
      }
  > {
    const isLogged = localStorage.getItem('_isLoggedIn');

    if (isLogged !== 'true') {
      return of(false);
    }
    this._isLoggedIn.next(true);
    return of(true);

    // return this.http
    //   .get<{ status: number; data: any }>(
    //     `${environment.BACKEND_BASE_URL}/api/user-logged`,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       withCredentials: true,
    //     }
    //   )
    //   .pipe(
    //     tap((resp: { status: number; data: any }) => {
    //       this._isLoggedIn.next(true);
    //     }),
    //     catchError((error) => {
    //       if (error.status === 401) {
    //         return of(true);
    //       }
    //       return of(false);
    //     })
    //   );
  }

  logout() {
    // this.http
    //   .post(
    //     `${environment.BACKEND_BASE_URL}/logout`,
    //     {},
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       withCredentials: true,
    //     }
    //   )
    //   .subscribe(() => {
    //     this._isLoggedIn.next(false);
    //     // this.user = undefined;
    //     this.router.navigate(['/login']);
    //   });
    localStorage.removeItem('_isLoggedIn');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  recoverPasswordEmail(email: string): Observable<Object> {
    return this.http.post(
      `${environment.BACKEND_BASE_URL}/forgot-password`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  postCreatePasswords(passwords: RecoverPasswords): Observable<Object> {
    return this.http.post(
      `${environment.BACKEND_BASE_URL}/reset-password`,
      { ...passwords },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      }
    );
  }
}
