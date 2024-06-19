import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { NavigationEnd, Router, Event } from '@angular/router';
import { environment } from '../../../environments/environments';
import { UserLoginResponse } from '../../models/auth';

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
      localStorage.getItem('access_token') && this._isLoggedIn.next(true);
  }

  login(user: {email:string,password:string}): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(
        `${environment.BACKEND_BASE_URL}/login`,
        { ...user }
      )
      .pipe(
        tap((res) => {
          if (this.lastUrl && this.lastUrl !== '/login') {
            this.router.navigate([this.lastUrl]);
            this.lastUrl = null;
          } else {
            this.router.navigate(['/']);
          }
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('access_token', res.data.token);
          this._isLoggedIn.next(true);
        })
      );
  }


  logout() {
    this.http
      .post(
        `${environment.BACKEND_BASE_URL}/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .subscribe(() => {
        this._isLoggedIn.next(false);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      });
  }

}
