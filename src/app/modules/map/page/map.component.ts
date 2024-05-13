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

    this.subscriptions.add(
      this.mapService.GeoJSON$.subscribe((GeoJSON) => {
        if (GeoJSON.features.length === 0) return;
        // // Add a new source from our GeoJSON data and set the
        map.addSource('observations', {
          type: 'geojson',
          data: GeoJSON as FeatureCollection<Geometry, { [name: string]: any }>,
          cluster: true,
          clusterMaxZoom: this.mapService.mapSettings.clusterMaxZoom, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });
        // Add a new source for spiderfy observations
        map.addSource('observationsSpiderfy', {
          type: 'geojson',
          data: this.mapService.initialGeoJson as FeatureCollection<
            Geometry,
            { [name: string]: any }
          >,
          cluster: false,
        });
        //Cluster background color
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'observations',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#D7B1F2',
            'circle-radius': 20,
            'circle-stroke-color': 'rgba(215, 177, 242, 0.5)',
            'circle-stroke-width': 5,
          },
        });
        //Cluster number count
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'observations',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });
        //Markers
        map.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'observations',
          filter: ['!has', 'point_count'],
          layout: {
            'icon-image': [
              'match',
              ['get', 'userType'],
              'citizen',
              '1-icon',
              '3-icon',
            ],
            'icon-size': 0.8,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });
        //Spiderfy markers
        map.addLayer({
          id: 'unclustered-point-spiderfy',
          type: 'symbol',
          source: 'observationsSpiderfy',
          layout: {
            'icon-image': [
              'match',
              ['get', 'userType'],
              'citizen',
              '1-icon',
              '3-icon',
            ],
            'icon-size': 0.8,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-offset': ['get', 'iconOffset'],
          },
        });
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
