import { Point } from './../../../../models/cone';
import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../layout/components/menu/app.menu.service';
import { MapComponent } from 'ngx-mapbox-gl';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
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

  public stateOptions: any[] = [
    {
      icon:"pi pi-map-marker",
      label: 'Registros',
      value: false
    },
    {
      icon:"pi pi-sun",
      label: 'Mapa de calor',
      value: true
    }
  ];

  private sidebarMenuIsOpen$!: Subscription;
  private studyZone$!: Subscription;

  public studyZone!: StudyZone;
  public points!: Point[];
  public intialPoint: Point = { longitude: 0, latitude: 0 };

  public APGEMOpoints: Point[] = [];
  public APGEMOpointsStyle: {} = {
    'circle-color': '#ff6200',
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  };

  public APGEMOpolygon: Polygon[] = [];
  public APGEMOpolygonStyle: {} = {
    'fill-outline-color': '#8ad1f9',
    'fill-color': '#7cbce0',
    'fill-opacity': 0.8,
  };



  public observations: Observation[] = [];

  public geoJsonObservation: any;
  public geoJsonRestObservation: any;

  public heatmapLayer: boolean = false;

  public filters:boolean = false;
  public showFilters:boolean = false;

  public sourceFilter!: any[];

  /*
    * @description: Constructor del componente RegistersMapComponent
    * Se suscribe a los cambios en el servicio de StudyZone, en el menú lateral y en el servicio de PDF
    * @param studyZoneService: StudyZoneService
    * @param menuService: MenuService
    * @param pdfService: PdfService
    * @returns void
  */
  constructor(
    private studyZoneService: StudyZoneService,
    private menuService: MenuService,
    private pdfService: PdfService
  ) {
    // Observa los cambios en el menú lateral y redimensiona el mapa
    this.sidebarMenuIsOpen$ = this.menuService.sidebarMenuIsOpen.subscribe(
      () => {
        setTimeout(() => {
          this.map.mapInstance.resize();
        }, 300);
      }
    );

    // Observa los cambios en el servicio de StudyZone y actualiza los datos del mapa
    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (studyZone) {
        this.studyZone = studyZone;
        this.studyZone.episodes.forEach((episode) => (
          this.observations.push(...episode.observations)
        ));
        this.observations.forEach((observation) => {
          this.intialPoint.longitude += observation.longitude / this.observations.length;
          this.intialPoint.latitude += observation.latitude / this.observations.length;
        });

        this.points = this.observations.map((observation) => {
          return {
            longitude: observation.longitude,
            latitude: observation.latitude,
          };
        });

        studyZone.APGEMO.forEach((point) => {
          if (Array.isArray(point)) {
            let polygon: Polygon = {
              geometry: {
                type: 'Polygon',
                coordinates: [point.map((pt) =>{
                  this.points.push(pt);
                  return [pt.longitude, pt.latitude]
                })],
              },
            };

            this.APGEMOpolygon.push(polygon);
          } else {
            this.points.push(point);
            this.APGEMOpoints.push(point);
          }
        });


        this.geoJsonObservation = {
          features: this.studyZone.restObservations.map(observation => observation.geoJson),
          type: "FeatureCollection"
        };

      }
    });

    // Espera al dibujado del mapa y ajusta el zoom
    setTimeout(() => {
      if (this.points) {
        const bbox = this.getBboxFromPointsAndObservations();

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

  /*
  * @description: Método que obtiene los puntos de las observaciones y APGEMOS para calcular como ajustar el zoom del mapa
  * @returns [[number, number], [number, number]]
  */
  private getBboxFromPointsAndObservations(): [[number, number], [number, number]] {
    let points = this.points;
    let observations = this.observations.map((observation) => ({
        longitude: observation.longitude,
        latitude: observation.latitude,
      })) || [];

    let minX: number = 0,
      maxX: number = 0,
      minY: number = 0,
      maxY: number = 0;

    points.forEach((p, i) => {
      if (i === 0) {
        minX = maxX = p.longitude;
        minY = maxY = p.latitude;
      } else {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
      }
    });

    observations.forEach((p) => {
        minX = Math.min(p.longitude, minX);
        minY = Math.min(p.latitude, minY);
        maxX = Math.max(p.longitude, maxX);
        maxY = Math.max(p.latitude, maxY);
    });

    return [
      [minX, minY],
      [maxX, maxY],
    ];
  }

  /*
    * @description: Método que se ejecuta al hacer click en el botón activa o desactiva los filtros
    * @param status: boolean
  */
  public toggleFilters(status: boolean | undefined = undefined):void {
    if((!this.sourceFilter || this.sourceFilter.length < 2) && this.showFilters === false){
      this.toggleShowFilters(true);
    }
    this.filters = status===undefined? !this.filters : status;
  }

  /*
    * @description: Método que se ejecuta al hacer click en el botón que muestro u oculta el modal de filtros
  */
  public toggleShowFilters(status: boolean | undefined = undefined):void {
    this.showFilters = status===undefined? !this.showFilters : status;
  }

  /*
    * @description: Método que se ejecuta al cambiar los filtros
    * @param status: boolean
  */
  public handleFilters(filters: any):void {
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

  /*
    * @description: Método que se ejecuta al destruir el componente
    * Desuscribe las observaciones
    * @returns void
  */
  ngOnDestroy() {
    this.sidebarMenuIsOpen$.unsubscribe();
    this.studyZone$.unsubscribe();
  }
}
