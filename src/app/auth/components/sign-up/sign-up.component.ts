import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  userSaved: boolean = false;
  constructor(private router: Router, private _auth: AuthService) {}

  signUp(user: object) {
    this._auth.register(user);
    this.userSaved = true;

    setTimeout(() => {
      this.userSaved = false;
    }, 3000);
  }

  ngOnInit(): void {}
}
