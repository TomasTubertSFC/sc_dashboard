import {
  Component,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';

import { AppSidebarComponent } from '../sidebar/app.sidebar.component';
import { AppTopBarComponent } from '../topbar/app.topbar.component';
import { MenuService } from '../menu/app.menu.service';
import { StudyZoneService } from '../../../services/study-zone.service';

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnDestroy {
  private overlayOpen = new Subject<any>();

  sidebarMenuIsOpen: boolean = false;

  overlayOpen$ = this.overlayOpen.asObservable();

  studyZone$!: Subscription;
  studyZoneid!: number | null;

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  menuMode: string = 'static';

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,
  };

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  constructor(
    public renderer: Renderer2,
    public router: Router,
    private menuService: MenuService,
    private studyZoneService: StudyZoneService
    ) {
    this.overlayMenuOpenSubscription = this.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen(
          'document',
          'click',
          (event) => {
            //All the components that triggers hidemenu
            const isOutsideClicked = !(
              this.appSidebar.el.nativeElement.isSameNode(event.target) ||
              this.appSidebar.el.nativeElement.contains(event.target) ||
              this.appTopbar.menuButton.nativeElement.isSameNode(
                event.target
              ) ||
              this.appTopbar.menuButton.nativeElement.contains(event.target)
            );

            if (isOutsideClicked) {
              this.hideMenu();
            }
          }
        );
      }

      if (this.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    //If route changes hide menu
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
      });

    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
      if(!studyZone) this.studyZoneid = null;
      if (studyZone && this.studyZoneService.studyZoneId) {
        this.studyZoneid = this.studyZoneService.studyZoneId;
      }
    });
  }

  //Toggle sidebar menu
  toggleSidebarMenu() {
    this.sidebarMenuIsOpen = !this.sidebarMenuIsOpen;
    this.menuService.sidebarMenuIsOpen = this.sidebarMenuIsOpen;
    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  hideMenu() {
    this.state.staticMenuMobileActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  //Block body scroll while overlay menu is open on mobile
  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
    }
  }

  //Toggle classes to show or not sidebar menu
  get containerClass() {
    return {
      'layout-static-inactive':
        this.state.staticMenuDesktopInactive && this.menuMode,
      'layout-mobile-active': this.state.staticMenuMobileActive,
    };
  }

  ngOnDestroy() {
    if (this.studyZone$) {
      this.studyZone$.unsubscribe();
    }
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
