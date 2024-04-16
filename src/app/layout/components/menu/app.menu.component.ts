import { OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../services/auth/auth.service';
import { PdfService } from '../../../services/pdf/pdf.service';
import { OdourCollectComponent } from '../../../shared/icons/odour-icon/odour-icon.component';
import { StudyZoneService } from '../../../services/study-zone.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent implements OnInit, OnDestroy {
  disabledAddToReports!: boolean;
  loading: boolean = false;
  subscriptions$: Subscription = new Subscription();
  studyZoneid!: number | null;

  constructor(
    private authService: AuthService,
    private pdfService: PdfService,
    private studyZoneService: StudyZoneService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.disabledAddToReports = event.url === '/dashboard/reports';
      });
    this.disabledAddToReports = this.router.url === '/dashboard/reports';

    this.subscriptions$.add(
      this.pdfService.loading.subscribe((res) => {
        if (!res) {
          this.loading = false;
        }
      })
    );

    this.subscriptions$.add(
      this.studyZoneService.studyZone.subscribe((studyZone) => {
        if (!studyZone) this.studyZoneid = null;
        if (studyZone && this.studyZoneService.studyZoneId) {
          this.studyZoneid = this.studyZoneService.studyZoneId;
        }
      })
    );
  }

  saveView(): void {
    this.loading = true;
    this.pdfService.saveView();
  }

  openStudyZoneModal() {
    this.studyZoneService.studyZoneModal = true;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }
}
