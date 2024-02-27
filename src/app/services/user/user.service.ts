import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';

export interface ChangePasswords {
  old_password: String;
  new_password: String;
  new_password_confirmation: String;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  changePassword(passwords: ChangePasswords): Observable<Object> {
    return this.http.post(
      `${environment.BACKEND_BASE_URL}/change-password`,
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
