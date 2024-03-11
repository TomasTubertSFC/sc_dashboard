import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../layout/components/menu/app.menu.service';
import { MapComponent } from 'ngx-mapbox-gl';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';

@Component({
  selector: 'app-registers-map',
  templateUrl: './registers-map.component.html',
  styleUrl: './registers-map.component.scss'
})
export class RegistersMapComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('map') map!: MapComponent;

  private sidebarMenuIsOpen$! : Subscription;
  private studyZone$! : Subscription;

  public studyZone!: StudyZone;
  public points!: Point[];
  public intialPoint!: Point;


  constructor(
    private studyZoneService: StudyZoneService,
    private menuService: MenuService
    ) {
      this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe((isOpen) => {
        setTimeout(() => {
          this.map.mapInstance.resize();
        },250);
      });
      this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
        if (studyZone) {
          this.studyZone = studyZone;

          this.points = studyZone.APGEMO.flat();
          let averageX = 0;
          let averageY = 0;
          this.points.map(point => {
            averageX += point.x/this.points.length;
            averageY += point.y/this.points.length;
          });
          this.intialPoint = { x: averageX, y: averageY };
        }
      });
    }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.sidebarMenuIsOpen$.unsubscribe();
    this.studyZone$.unsubscribe();
  }
}
