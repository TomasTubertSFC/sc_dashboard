import { APP_INITIALIZER, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { initializeInterceptorProvider } from './helpers/intializeApp';
import { RecoverPasswordModule } from './modules/recover-password/recover-password.module';
import { ProfileModule } from './modules/profile/profile.module';
import { LandingModule } from './modules/landing/landing.module';
import { MapModule } from './modules/map/map.module';
import { LoginModule } from './modules/login/login.module';
import { MessageService } from 'primeng/api';

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
    MapModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    MessageService,
    // initializeInterceptorProvider,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    // authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
