import { MainComponent } from './pages/components/main/main.component';
import { NotFoundComponent } from './pages/components/not-found/not-found.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomepageComponent } from './pages/components/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhenLoggedIn } from './auth/services/when-logged-in.service';
import { WhenLoggedOut } from './auth/services/when-logged-out.service';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent, canActivate: [WhenLoggedOut] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [WhenLoggedOut] },
  { path: 'main', component: MainComponent, canActivate: [WhenLoggedIn] },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
