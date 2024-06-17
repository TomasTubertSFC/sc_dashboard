import { APP_INITIALIZER, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { initializeInterceptorProvider } from './helpers/intializeApp';
import { RecoverPasswordModule } from './modules/recover-password/recover-password.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MapModule } from './modules/map/map.module';
import { LoginModule } from './modules/login/login.module';
import { MessageService } from 'primeng/api';
import { OverviewModule } from './modules/overview/overview.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environments';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
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
    MapModule,
    OverviewModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    TranslateModule.forRoot({
      defaultLanguage: environment.DEFAULT_LANGUAGE,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
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
