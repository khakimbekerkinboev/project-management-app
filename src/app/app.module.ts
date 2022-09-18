import { WhenLoggedIn } from './auth/services/when-logged-in.service';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthService } from './auth/services/auth.service';
import { WhenLoggedOut } from './auth/services/when-logged-out.service';
import { MainService } from './pages/services/main.service';
import { TokenInterceptorService } from './auth/interceptors/token-interceptor.service';
import { UserService } from './auth/services/user.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    PagesModule,
    AuthModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthService,
    WhenLoggedIn,
    WhenLoggedOut,
    MainService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    HttpClient,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
