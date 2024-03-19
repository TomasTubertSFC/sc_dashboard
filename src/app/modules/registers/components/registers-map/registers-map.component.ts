import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../layout/components/menu/app.menu.service';
import { MapComponent } from 'ngx-mapbox-gl';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
import { Point } from 'chart.js';
import { Observation } from '../../../../models/observation';
import { Polygon } from '../../../../models/polygon';
import { HttpClient } from '@angular/common/http';
import { GeoJSONSourceComponent } from "ngx-mapbox-gl";

@Component({
  selector: 'app-registers-map',
  templateUrl: './registers-map.component.html',
  styleUrl: './registers-map.component.scss'
})
export class RegistersMapComponent implements OnDestroy{

  @ViewChild('map') map!: MapComponent;

  private sidebarMenuIsOpen$! : Subscription;
  private studyZone$! : Subscription;

  public studyZone!: StudyZone;
  public points!: Point[];
  public intialPoint: Point = {x: 0, y: 0};
  public APGEMOpoints: Point[] = [];
  public APGEMOpolygon: Polygon[] = [];
  public APGEMOpolygonStyle: {} =
    {
      'fill-outline-color': '#363c69',
      'fill-color': '#348ac7',
      'fill-opacity': 0.8
    };

  public observations: Observation[] = [];
  public restObservations: Observation[] = [];

  public geoJsonObservation: any;
  public geoJsonRestObservation: any;

  public heatmapLayer:boolean = false;

  public filters:boolean = false;
  public showFilters:boolean = false;

  public registersFilter!: any;




  constructor(
    private studyZoneService: StudyZoneService,
    private menuService: MenuService,
    ) {

    this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe((isOpen) => {
      setTimeout(() => {
        this.map.mapInstance.resize();
      },300);
    });

    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {

      if (studyZone) {

        this.studyZone = studyZone;
        this.studyZone.episodes.forEach(episode => this.observations = this.observations.concat(episode.observations));
        this.observations.forEach(observation => {
          this.intialPoint.x += observation.longitude/this.observations.length;
          this.intialPoint.y += observation.latitude/this.observations.length;
        });

        this.points = this.observations.map(observation => {
          return {
            x: observation.longitude,
            y: observation.latitude
          };
        });

        studyZone.APGEMO.forEach(point => {
          if (Array.isArray(point)) {
            let polygon:Polygon = {
              geometry: {
                type: 'Polygon',
                coordinates: [point.map(pt => [pt.x, pt.y])]
              }
            };

            this.APGEMOpolygon.push(polygon);

          }
          else {
            this.APGEMOpoints.push(point);
          }
        });

        this.points = this.points.concat(this.APGEMOpoints);

        this.geoJsonObservation = {
          features: this.observations.map(observation => observation.geoJson),
          type: "FeatureCollection"
        };
        console.log(this.geoJsonObservation);

        this.geoJsonRestObservation = {
          features: this.studyZone.restObservations.map(observation => observation.geoJson),
          type: "FeatureCollection"
        };

      }
    });

    setTimeout(() => {
      if(this.points){
        const bbox = this.getBboxFromPoints();
        this.map.mapInstance.fitBounds(bbox, {
          padding: {top: 100, bottom:50, left: 50, right: 50}
        });
      }
    });


  }

  private getBboxFromPoints(): [[number,number], [number, number]] {
    let points = this.points;

    let minX:number = 0, maxX:number = 0, minY:number = 0, maxY:number = 0;

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

    return [[minX, minY], [maxX, maxY]];

  }

  ngOnDestroy() {
    this.sidebarMenuIsOpen$.unsubscribe();
    this.studyZone$.unsubscribe();
  }

  public toggleHeatmapLayer(status: boolean | undefined = undefined) {
    this.heatmapLayer = status===undefined? !this.heatmapLayer : status;
  }

  public toggleFilters(status: boolean | undefined = undefined) {
    this.filters = status===undefined? !this.filters : status;
  }

  public toggleShowFilters(status: boolean | undefined = undefined) {
    this.showFilters = !this.showFilters;
  }

  public handleFilters(filters: any) {
    this.registersFilter = ['all'];
    if(filters.hedonicTone){
      this.registersFilter.push(['<=', 'hedonicTone', filters.hedonicToneFilter[1]], ['>=', 'hedonicTone', filters.hedonicToneFilter[0]]);
    }
    if(filters.intensity){
      this.registersFilter.push(['<=', 'intensity', filters.intensityFilter[1]], ['>=', 'intensity', filters.intensityFilter[0]]);
    }
  }
}
