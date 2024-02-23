import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './components/menu/app.menu.component';
import { AppMenuitemComponent } from './components/menuItem/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';
import { AppFooterComponent } from './components/footer/app.footer.component';
import { AppSidebarComponent } from './components/sidebar/app.sidebar.component';
import { AppLayoutComponent } from './components/layout/app.layout.component';
import { SharedComponentsModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SidebarModule,
    RippleModule,
    RouterModule,
    ButtonModule,
    SharedComponentsModule
  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
