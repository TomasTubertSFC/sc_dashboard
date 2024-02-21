import { Component, OnDestroy, Renderer2, ViewChild, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';
// import { LayoutService } from './service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppTopBarComponent } from './app.topbar.component';


 interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnDestroy {

  sidebarMenuIsOpen: boolean = false;

  private overlayOpen = new Subject<any>();

    overlayOpen$ = this.overlayOpen.asObservable();

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  _config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
};

  config = signal<any>(this._config);

  state: LayoutState = {
      staticMenuDesktopInactive: false,
      overlayMenuActive: false,
      profileSidebarVisible: false,
      configSidebarVisible: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
  };

  constructor(
    // public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router
  ) {
    this.overlayMenuOpenSubscription =
      this.overlayOpen$.subscribe(() => {
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
        // this.hideProfileMenu();
      });
  }

  toggleSidebarMenu() {
    this.sidebarMenuIsOpen = !this.sidebarMenuIsOpen;
    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
          !this.state.staticMenuDesktopInactive;
  } else {
      this.state.staticMenuMobileActive =
          !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
          this.overlayOpen.next(null);
      }
  }
  }

  hideMenu() {
    this.state.overlayMenuActive = false;
    this.state.staticMenuMobileActive = false;
    this.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  isDesktop() {
    return window.innerWidth > 991;
}

  // hideProfileMenu() {
  //   this.layoutService.state.profileSidebarVisible = false;
  //   if (this.profileMenuOutsideClickListener) {
  //     this.profileMenuOutsideClickListener();
  //     this.profileMenuOutsideClickListener = null;
  //   }
  // }

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

  get containerClass() {//Si comento esto el menú no se esconde
    return {
      // 'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      // 'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.config().menuMode === 'overlay',
      'layout-static': this.config().menuMode === 'static',
      'layout-static-inactive':
        this.state.staticMenuDesktopInactive &&
        this.config().menuMode === 'static',
      'layout-overlay-active': this.state.overlayMenuActive,
      'layout-mobile-active': this.state.staticMenuMobileActive,
      // 'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      // 'p-ripple-disabled': !this.layoutService.config().ripple,
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
