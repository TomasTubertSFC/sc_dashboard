import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/components/layout/app.layout.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RecoverPasswordComponent } from './modules/recover-password/components/recover-password/recover-password.component';
import { CreatePasswordComponent } from './modules/recover-password/components/create-password/create-password.component';
import { ProfileComponent } from './modules/profile/components/profile/profile.component';
import { LandingComponent } from './modules/landing/components/landing/landing.component';
import { OverviewComponent } from './modules/overview/components/overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'dashboard',
    component: AppLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'episodes',
        loadChildren: () =>
          import('./modules/episodes/episodes.module').then(
            (m) => m.EpisodesModule
          ),
      },
      {
        path: 'registers',
        loadChildren: () =>
          import('./modules/registers/registers.module').then(
            (m) => m.RegistersModule
          ),
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
