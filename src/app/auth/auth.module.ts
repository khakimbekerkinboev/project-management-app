import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [LoginComponent, SignUpComponent, EditProfileComponent],
  exports: [LoginComponent, SignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    TranslateModule,
  ],
})
export class AuthModule {}
