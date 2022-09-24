import { TranslateService } from '@ngx-translate/core';
import { UserService } from './../../../auth/services/user.service';
import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  lang: any;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    if (this.authService.isLoggedIn()) {
      this.userService.setCurrentUserToProfile();
    }
  }

  changeLang(event: any) {
    const lang = event.target.value;
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  toggleProfile() {
    const profileContainer = document.querySelector('.profile-container');
    const accountBtn = document.querySelector('.account-btn');

    profileContainer?.classList.toggle('profile-hidden');
    accountBtn?.classList.toggle('account-inactive');
  }

  closeProfile() {
    const profileContainer = document.querySelector('.profile-container');
    const accountBtn = document.querySelector('.account-btn');

    profileContainer?.classList.add('profile-hidden');
    accountBtn?.classList.add('account-inactive');
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
  }
}

window.addEventListener('click', (e: any) => {
  const profileContainer = document.querySelector('.profile-container');
  const accountBtn = document.querySelector('.account-btn');
  const isNotAccountBtn =
    !e.target?.classList?.contains('fa-caret-down') &&
    !e.target?.classList?.contains('account-btn');
  const profileIsOpen =
    !profileContainer?.classList?.contains('profile-hidden') &&
    !accountBtn?.classList?.contains('account-inactive');

  if (isNotAccountBtn && profileIsOpen) {
    profileContainer?.classList.add('profile-hidden');
    accountBtn?.classList.add('account-inactive');
  }
});
