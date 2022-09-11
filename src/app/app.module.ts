import { WhenLoggedIn } from './auth/services/when-logged-in.service';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/services/auth.service';
import { WhenLoggedOut } from './auth/services/when-logged-out.service';
import { BoardsService } from './pages/services/boards.service';
import { TokenInterceptorService } from './auth/interceptors/token-interceptor.service';

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
  providers: [
    AuthService,
    WhenLoggedIn,
    WhenLoggedOut,
    BoardsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
