import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppLayoutModule,
    AppRoutingModule,
    SharedComponentsModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
