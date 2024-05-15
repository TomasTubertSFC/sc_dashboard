/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl';

Mapboxgl.accessToken = 'pk.eyJ1IjoibmV0aWZpZzM1MiIsImEiOiJjbGdxZTkyMWUwOGRtM2xvaGthYjc5Y2o5In0.VScKg8C5GKMaKX3NtK9qgA';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
