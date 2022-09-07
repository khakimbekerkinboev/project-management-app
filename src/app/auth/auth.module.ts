import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  exports: [LoginComponent, SignUpComponent],
  imports: [CommonModule, FormsModule],
})
export class AuthModule {}
