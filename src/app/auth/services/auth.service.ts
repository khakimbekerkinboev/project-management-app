import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = 'https://proj-manag-sys.herokuapp.com/signup';
  private _loginUrl = 'https://proj-manag-sys.herokuapp.com/signin';

  constructor(private http: HttpClient) {}

  login(user: object) {
    return this.http.post(this._loginUrl, user).pipe(
      map((res) => {
        if (res && res.hasOwnProperty('token')) {
          const map = new Map(Object.entries(res));
          localStorage.setItem('token', map.get('token'));
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  register(user: object) {
    return this.http.post(this._registerUrl, user).pipe(
      map((res) => {
        if (res.hasOwnProperty('id')) {
          const map = new Map(Object.entries(user));
          const signedUser = {
            login: map.get('login'),
            password: map.get('password'),
          };

          this.http.post(this._loginUrl, signedUser).subscribe((res) => {
            if (res && res.hasOwnProperty('token')) {
              const map = new Map(Object.entries(res));
              localStorage.setItem('token', map.get('token'));
            }
          });

          return true;
        } else {
          return false;
        }
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  isLoggedIn() {
    return false;
  }
}
