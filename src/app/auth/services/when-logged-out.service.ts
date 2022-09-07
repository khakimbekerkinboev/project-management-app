import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WhenLoggedOut implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate() {
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['**']);
      return false;
    }
  }
}
