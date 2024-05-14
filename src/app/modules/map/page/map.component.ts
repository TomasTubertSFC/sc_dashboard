import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { Map } from 'mapbox-gl';
import { MapService } from '../../../services/map/map.service';
import { FeatureCollection, Geometry } from 'geojson';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  private mapService = inject(MapService);

  public showFilters: WritableSignal<boolean> = signal<boolean>(false);
  public activeFilters: boolean = false;
  private subscriptions = new Subscription();

  constructor() {
    this.subscriptions.add(
      this.mapService.isFilterActive.subscribe((value) => {
        this.activeFilters = value;
      })
    );
  }

  public toogleActiveFilters(): void {
    this.mapService.isFilterActive.next(!this.activeFilters);
  }

  ngAfterViewInit(): void {
    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: this.mapService.mapSettings.mapStyle, // style URL
      center: this.mapService.mapSettings.centerMapLocation, // starting position [lng, lat]
      zoom: this.mapService.mapSettings.zoom, // starting zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      language: 'ca',
      limit: 5,
      mapboxgl: mapboxgl,
      marker: false,
      zoom: 17,
    });

    map.addControl(geocoder, 'top-left');

    this.mapService.setMap(map);

    this.mapService.initializeMap();
    this.mapService.getAllMapObservations();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.mapService.map = null;
  }
}
