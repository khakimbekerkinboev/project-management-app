import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  signIn(user: any) {
    this.authService.login(user).subscribe((result) => {
      if (result) {
        this.router.navigate(['/main']);
      } else {
        this.invalidLogin = true;
        setTimeout(() => {
          this.invalidLogin = false;
        }, 3000);
      }
    });
  }

  ngOnInit(): void {}
}
