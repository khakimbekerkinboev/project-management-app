import { WhenLoggedIn } from './auth/services/when-logged-in.service';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/services/auth.service';
import { WhenLoggedOut } from './auth/services/when-logged-out.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    PagesModule,
    AuthModule,
    HttpClientModule,
  ],
  providers: [AuthService, WhenLoggedIn, WhenLoggedOut],
  bootstrap: [AppComponent],
})
export class AppModule {}
