import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';

import { MenuService } from '../menu/app.menu.service';
import { MapService } from '../../../services/map/map.service';
import { ObservationsService } from '../../../services/observations/observations.service';

interface LayoutState {
  overlayMenuActive: boolean;
  staticMenuMobileActive: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent {
  mapService = inject(MapService);
  observationService = inject(ObservationsService);

  loading: boolean = false;
}
