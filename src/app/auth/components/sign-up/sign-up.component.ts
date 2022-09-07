import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpError: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  signUp(user: object) {
    this.authService.register(user).subscribe((result) => {
      if (result) {
        console.log(result);
        this.authService.loginRightAfterRegister(user, () => {
          this.router.navigate(['/main']);
        });
      } else {
        this.signUpError = true;
        setTimeout(() => {
          this.signUpError = false;
        }, 3000);
      }
    });
  }

  ngOnInit(): void {}
}
