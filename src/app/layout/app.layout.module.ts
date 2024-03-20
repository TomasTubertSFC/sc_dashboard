import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppMenuComponent } from './components/menu/app.menu.component';
import { AppMenuitemComponent } from './components/menuItem/app.menuitem.component';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';
import { AppFooterComponent } from './components/footer/app.footer.component';
import { AppSidebarComponent } from './components/sidebar/app.sidebar.component';
import { AppLayoutComponent } from './components/layout/app.layout.component';
import { SharedComponentsModule } from '../shared/shared.module';

import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    AppFooterComponent,
    AppLayoutComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppSidebarComponent,
    AppTopBarComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    HttpClientModule,
    MenuModule,
    RippleModule,
    RouterModule,
    SharedComponentsModule,
    SidebarModule,
    SkeletonModule,
    ToastModule
  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
