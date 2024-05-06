import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent {
  loading: boolean = false;

  constructor(
    private authService: AuthService,
  ) {}

  logout(): void {
    this.authService.logout();
  }

}
