import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { StudyZoneService } from '../../../services/study-zone.service';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  @Input() studyZoneId: number | undefined | null;
  @Output() toggleSidebar = new EventEmitter<void>();

  @ViewChild('menubutton') menuButton!: ElementRef;

  profileItems: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private studyZoneService: StudyZoneService

  ) {}

  ngOnInit() {
    this.profileItems = [
      {
        label: 'Mi perfil',
        icon: 'pi pi-user',
        routerLink: '/dashboard/profile',
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

  openStudyZoneModal() {
    this.studyZoneService.studyZoneModal = true;
  }

}
