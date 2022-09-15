import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  updateUserError: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.userService.getCurrentUser().subscribe((res: any) => {
      const editProfilePage = document.querySelector('.edit-profile-page');
      const nameInput: any = editProfilePage?.querySelector('#name');
      const loginInput: any = editProfilePage?.querySelector('#login');

      nameInput.placeholder = res.name;
      loginInput.placeholder = res.login;
    });
  }

  updateUser(user: object) {
    this.userService.update(user).subscribe((res) => {
      if (res) {
        this.authService.loginRightAfterRegister(user, () => {
          this.router.navigate(['/main']);
        });
        this.userService.setCurrentUserToProfile();
      } else {
        this.updateUserError = true;
        setTimeout(() => {
          this.updateUserError = false;
        }, 3000);
      }
    });
  }

  deleteAccount() {
    this.userService.delete().subscribe((res) => {
      this.authService.logout();
    });

    this.closeAccountDeleteWindow();
    this.router.navigate(['/']);
  }

  showAccountDelete() {
    const accountDelete = document.querySelector('.account-delete');
    accountDelete?.classList.remove('account-delete-hidden');

    const deleteTitle: any = accountDelete?.querySelector('h6');
    deleteTitle.innerHTML = `Are you sure you want to <strong>delete your account</strong>?`;

    const deleteBtn = accountDelete?.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      this.deleteAccount();
      deleteBtn?.replaceWith(deleteBtn.cloneNode(true));
    });

    const cancelBtn = accountDelete?.querySelector('.cancel-btn');
    cancelBtn?.addEventListener('click', () => {
      this.closeAccountDeleteWindow();
      cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
    });
  }

  closeAccountDeleteWindow() {
    const accountDelete = document.querySelector('.account-delete');
    accountDelete?.classList.add('account-delete-hidden');
  }

  hideAccountDelete($event: any) {
    if ($event.target.classList.contains('account-delete')) {
      this.closeAccountDeleteWindow();
    }
  }

  ngOnInit(): void {}
}
