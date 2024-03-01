import { APP_INITIALIZER, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { LoginModule } from './modules/login/login.module';
import { initializeInterceptorProvider } from './helpers/intializeApp';
import { RecoverPasswordModule } from './modules/recover-password/recover-password.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { LandingModule } from './modules/landing/landing.module';
import { OverviewModule } from './modules/overview/overview.module';

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
    LandingModule,
    OverviewModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    NgxMapboxGLModule.withConfig({
      accessToken:
        'pk.eyJ1IjoibmV0aWZpZzM1MiIsImEiOiJjbHN4Yzcyc3AwMW8xMmtwMnVlenEyaGQ0In0.SMd509FY7jcvLxBPpbw0pA',
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
