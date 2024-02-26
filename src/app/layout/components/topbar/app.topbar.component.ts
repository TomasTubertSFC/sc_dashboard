import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  @ViewChild('menubutton') menuButton!: ElementRef;

  profileItems: MenuItem[] | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.profileItems = [
      {
        label: 'Mi perfil',
        icon: 'pi pi-user',
        url: '/',
      },
      {
        label: 'Cerrar sessión',
        icon: 'pi pi-times',
        command: () => {
          this.authService.logout();
        },
      },
    ];
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
