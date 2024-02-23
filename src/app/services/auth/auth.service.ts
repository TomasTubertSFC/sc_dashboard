import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { NavigationEnd, Router, Event } from '@angular/router';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private lastUrl!: string | null;

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this._isLoggedIn;
  }

  set isLoggedIn(status: boolean) {
    // if(status === false) this.user = undefined; //si el usuario no esta logueado, eliminamos el usuario del servicio (para que no se quede el usuario anterior)
    this._isLoggedIn.next(status);
  }

  constructor(private http: HttpClient, private router: Router) {
    // this.router.events
    //   .pipe(
    //     filter(
    //       (event: Event): event is NavigationEnd =>
    //         event instanceof NavigationEnd
    //     )
    //   )
    //   .subscribe((event: NavigationEnd) => {
    //     this.lastUrl = event.urlAfterRedirects;
    //   });
  }

  login(user: any): Observable<Object> {
    return this.http
      .post(
        `${environment.BACKEND_BASE_URL}/login`,
        { ...user },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          //Esto lo hace para redirigir a la ruta que se intentó acceder antes
          // if (this.lastUrl) {
          //   this.router.navigate([this.lastUrl]);
          //   this.lastUrl = null;
          // } else {
          //   console.log('else', this.lastUrl);
          //   this.router.navigate(['/']);
          // }
          console.log('tap iss looggedin');
          this._isLoggedIn.next(true);
          //TODO alerta "Hubo un error"
        })
      );
  }

  userIsLogged(): Observable< boolean | {
        status: number;
        data: any;
      }
  > {
    // if (!this.tokenExtractor.getToken() && !fromErrorPage) { //si no es llama al función desde la pagina de error y no tenemos token redirigimos a onboarding
    //   this.router.navigate(['']);
    // }
    return this.http.get<{ status: number; data: any }>(
        `${environment.BACKEND_BASE_URL}/api/user-logged`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap((resp: { status: number; data: any }) => {
          // this.user = new User(resp.data);
          this._isLoggedIn.next(true);
        }),
        catchError((error) => {
          if (error.status === 401) {
            //si es error 401 le devolvemos a la pagina de error un true, para que permita navegar, ya que no es un error de servidor
            return of(true);
          }
          return of(false);
        })
      );
  }
}
