import {Component, AfterViewInit, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../layout/components/menu/app.menu.service';
import { MapComponent } from 'ngx-mapbox-gl';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';
import { Observation } from '../../../../models/observation';
import { Polygon } from '../../../../models/polygon';
import { PdfService } from '../../../../services/pdf/pdf.service';

@Component({
  selector: 'app-registers-map',
  templateUrl: './registers-map.component.html',
  styleUrl: './registers-map.component.scss',
})
export class RegistersMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('map') map!: MapComponent;

  private sidebarMenuIsOpen$!: Subscription;
  private studyZone$!: Subscription;

  public studyZone!: StudyZone;
  public points!: Point[];
  public intialPoint: Point = { x: 0, y: 0 };
  public APGEMOpoints: Point[] = [];
  public APGEMOpolygon: Polygon[] = [];
  public APGEMOpolygonStyle: {} = {
    'fill-outline-color': '#363c69',
    'fill-color': '#348ac7',
    'fill-opacity': 0.8,
  };

  public observations: Observation[] = [];

  public geoJsonObservation: any;
  public geoJsonRestObservation: any;

  public heatmapLayer: boolean = false;

  public filters:boolean = false;
  public showFilters:boolean = false;

  public sourceFilter!: any[];

  constructor(
    private studyZoneService: StudyZoneService,
    private menuService: MenuService,
    private pdfService: PdfService
  ) {
    this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe(
      () => {
        setTimeout(() => {
          this.map.mapInstance.resize();
        }, 300);
      }
    );

    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (studyZone) {
        this.studyZone = studyZone;
        this.studyZone.episodes.forEach(
          (episode) =>
            (this.observations = episode.observations)
        );
        this.observations.forEach((observation) => {
          this.intialPoint.x += observation.longitude / this.observations.length;
          this.intialPoint.y += observation.latitude / this.observations.length;
        });

        this.points = this.observations.map((observation) => {
          return {
            x: observation.longitude,
            y: observation.latitude,
          };
        });

        studyZone.APGEMO.forEach((point) => {
          if (Array.isArray(point)) {
            let polygon: Polygon = {
              geometry: {
                type: 'Polygon',
                coordinates: [point.map((pt) => [pt.x, pt.y])],
              },
            };

            this.APGEMOpolygon.push(polygon);
          } else {
            this.APGEMOpoints.push(point);
          }
        });

        this.points = this.points.concat(this.APGEMOpoints);

        this.geoJsonObservation = {
          features: this.observations.map(observation => observation.geoJson).concat(this.studyZone.restObservations.map(observation => observation.geoJson)),
          type: "FeatureCollection"
        };

      }
    });

    setTimeout(() => {
      if (this.points) {
        const bbox = this.getBboxFromPoints();

        this.map.mapInstance.fitBounds(bbox, {
          padding: { top: 100, bottom: 50, left: 50, right: 50 },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    const reportsElements = this.pdfService.reportsElements.getValue();

    this.pdfService.reportsElements.next({
      ...reportsElements,
      4: this.mapContainer,
    });
  }

  private getBboxFromPoints(): [[number, number], [number, number]] {
    let points = this.points;

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.x;
        minY = maxY = p.y;
      } else {
        minX = Math.min(p.x, minX);
        minY = Math.min(p.y, minY);
        maxX = Math.max(p.x, maxX);
        maxY = Math.max(p.y, maxY);
      }
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  ngOnDestroy() {
    this.sidebarMenuIsOpen$.unsubscribe();
    this.studyZone$.unsubscribe();
  }

  public toggleHeatmapLayer(status: boolean | undefined = undefined) {
    this.heatmapLayer = status === undefined ? !this.heatmapLayer : status;
  }

  public toggleFilters(status: boolean | undefined = undefined) {
    if((!this.sourceFilter || this.sourceFilter.length < 2) && this.showFilters === false){
      this.toggleShowFilters(true);
    }
    this.filters = status===undefined? !this.filters : status;
  }

  public toggleShowFilters(status: boolean | undefined = undefined) {
    this.showFilters = status===undefined? !this.showFilters : status;
  }

  public handleFilters(filters: any) {
    this.sourceFilter = ['all'];
    if(filters.type){
      this.sourceFilter.push(
        ['in', ['get', 'odourType'], ['literal',[...Object.keys(filters.typeFilter).filter( key => filters.typeFilter[key] ).map(id=> Number(id))]]]
        );
    }
    if(filters.hedonicTone){
      this.sourceFilter.push(
        ['<=', ['get', 'hedonicTone'], filters.hedonicToneFilter[1]],
        ['>=', ['get', 'hedonicTone'], filters.hedonicToneFilter[0]]
        );
    }
    if(filters.intensity){
      this.sourceFilter.push(
        ['<=', ['get', 'intensity'], filters.intensityFilter[1]],
        ['>=', ['get', 'intensity'], filters.intensityFilter[0]]
        );
    }
    if(filters.days){
      var datePipe = new DatePipe('en-US');
      if(filters.daysFilter[0] && filters.daysFilter[1]){
        this.sourceFilter.push(
          ['>=', ['get', 'date'], datePipe.transform(filters.daysFilter[0],'yyyy-MM-dd')],
          ['<=', ['get', 'date'], datePipe.transform(filters.daysFilter[1],'yyyy-MM-dd')]
          );
      }
      else if(filters.daysFilter[0] && !filters.daysFilter[1]){
        this.sourceFilter.push(
          ['==', ['get', 'date'], datePipe.transform(filters.daysFilter[0],'yyyy-MM-dd')]
          );

      }
    }
    if(filters.hours){
      this.sourceFilter.push(
        ['>=', ['get', 'hour'], filters.hoursFilter[0]],
        ['<=', ['get', 'hour'], filters.hoursFilter[1]]
        );
    }
    this.sourceFilter.length > 1? this.filters = true : this.filters = false;

  }
}
