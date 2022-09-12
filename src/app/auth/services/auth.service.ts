import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = 'https://proj-manag-sys.herokuapp.com/signup';
  private _loginUrl = 'https://proj-manag-sys.herokuapp.com/signin';
  private _usersUrl = 'https://proj-manag-sys.herokuapp.com/users';

  helper = new JwtHelperService();

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

  loginRightAfterRegister(user: object, callback: Function) {
    const map = new Map(Object.entries(user));
    const signedUser = {
      login: map.get('login'),
      password: map.get('password'),
    };

    this.http.post(this._loginUrl, signedUser).subscribe((res) => {
      if (res && res.hasOwnProperty('token')) {
        const map = new Map(Object.entries(res));
        localStorage.setItem('token', map.get('token'));
        callback();
      }
    });
  }

  register(user: object) {
    return this.http.post(this._registerUrl, user).pipe(
      map((res) => {
        if (res.hasOwnProperty('id')) {
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
    const token = localStorage.getItem('token');
    return !this.helper.isTokenExpired(token!);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;

    return this.http.get(this._usersUrl + '/' + userId);
  }

  setCurrentUserToProfile() {
    this.getCurrentUser().subscribe((res: any) => {
      const accountBtn: any = document.querySelector('.account-btn');
      accountBtn.innerHTML =
        res.name + ' ' + '<i class="fa-solid fa-angle-down"></i>';
    });
  }
}
