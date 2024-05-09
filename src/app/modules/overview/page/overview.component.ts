import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { Map } from 'mapbox-gl';
import { MapService } from '../../../services/map/map.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  private mapService = inject(MapService);

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

    map.addControl(geocoder);

    this.mapService.setMap(map);
  }
}
