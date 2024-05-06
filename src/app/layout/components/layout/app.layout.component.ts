import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';

import { MenuService } from '../menu/app.menu.service';

interface LayoutState {
  overlayMenuActive: boolean;
  staticMenuMobileActive: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent {

  loading: boolean = false;

}
