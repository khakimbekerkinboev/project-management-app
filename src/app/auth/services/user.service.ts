import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _usersUrl = 'https://proj-manag-sys.herokuapp.com/users';
  constructor(private http: HttpClient) {}

  getCurrentUser() {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId: any = decoded.userId;
    return this.http.get(this._usersUrl + '/' + userId);
  }

  setCurrentUserToProfile() {
    this.getCurrentUser().subscribe((res: any) => {
      const accountBtn: any = document.querySelector('.account-btn');
      accountBtn.innerHTML =
        res.name + '<i class="fa-solid fa-caret-down"></i>';
    });
  }

  update(user: any) {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;
    return this.http.put(this._usersUrl + '/' + userId, user).pipe(
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

  delete() {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;
    return this.http.delete(this._usersUrl + '/' + userId);
  }
}
