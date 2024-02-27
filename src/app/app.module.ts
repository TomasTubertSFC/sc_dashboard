import { APP_INITIALIZER, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { LoginModule } from './modules/login/login.module';
import { initializeInterceptorProvider } from './helpers/intializeApp';
import { AuthService } from './services/auth/auth.service';
import { RecoverPasswordModule } from './modules/recover-password/recover-password.module';
import { ProfileModule } from './modules/profile/profile.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppLayoutModule,
    AppRoutingModule,
    SharedComponentsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoginModule,
    RecoverPasswordModule,
    ProfileModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    initializeInterceptorProvider,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
