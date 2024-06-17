import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/components/layout/app.layout.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RecoverPasswordComponent } from './modules/recover-password/components/recover-password/recover-password.component';
import { CreatePasswordComponent } from './modules/recover-password/components/create-password/create-password.component';
import { ProfileComponent } from './modules/profile/components/profile/profile.component';
import { MapComponent } from './modules/map/page/map.component';
import { OverviewComponent } from './modules/overview/page/overview/overview.component';
import { SoundscapeComponent } from './modules/soundscape/page/soundscape.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: LandingComponent,
  // },
  {
    path: '',
    component: AppLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MapComponent,
      },
      {
        path: 'soundscape',
        component: SoundscapeComponent,
      },
      {
        path: 'resum',
        component: OverviewComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
  },
  {
    path: 'password-reset/:token',
    component: CreatePasswordComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
