import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/components/layout/app.layout.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RecoverPasswordComponent } from './modules/recover-password/components/recover-password/recover-password.component';
import { CreatePasswordComponent } from './modules/recover-password/components/create-password/create-password.component';
import { ProfileComponent } from './modules/profile/components/profile/profile.component';
import { LandingComponent } from './modules/landing/components/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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
  {
    path: 'landing',
    component: LandingComponent,
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
