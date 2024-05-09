import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ObservationsService } from '../observations/observations.service';
import { MapObservation } from '../../models/map';
import { LngLat, LngLatBounds, LngLatLike, Map } from 'mapbox-gl';

export interface ObservationGeoJSON {
  type: string;
  features: [];
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;

  get isMapReady(): boolean {
    return !!this.map;
  }

  public mapSettings: {
    zoom: number;
    mapStyle: string;
    centerMapLocation: [number, number] | undefined;
    minZoom: number;
    maxZoom: number;
    bounds: LngLatBounds;
    clusterMaxZoom: number;
  } = {
    zoom: 4,
    mapStyle: 'mapbox://styles/mapbox/light-v10',
    centerMapLocation: [2.1487613, 41.3776589],
    minZoom: 2,
    maxZoom: 17,
    bounds: new LngLatBounds(new LngLat(-90, 90), new LngLat(90, -90)),
    clusterMaxZoom: 17,
  };

  constructor(
    private http: HttpClient,
    private observationsService: ObservationsService
  ) {
    this.observationsService.observations$.subscribe((observations) => {
      this.getAllMapObservations(observations);
    });
  }

  //Desde aquí he de poder gestionar el filtrado de las observaciones y el coseguir las observaciones de la base de datos
  //Observations service va a traer sus observaciones y map las suyas

  //Conseguir todos los olores en el constructor
  public getAllMapObservations(observations: any): void {
    this.http
      .get<{ data: MapObservation[] }>(
        `${environment.BACKEND_BASE_URL}/map/observations`
      )
      .subscribe(({ data }) => {
        console.log('observations', observations[0], observations.lenght);
        console.log('data', data[0], observations.lenght);
        const mapObs = data.map((obs,idx) => {
          const observation = observations[idx]
          return {
            ...obs,
            created_at: new Date(observation.created_at),
          }
        })
      });
  }

  public setMap(map: Map): void {
    this.map = map;
  }

  public flyTo(coords: LngLatLike): void {
    if (!this.map) return;
    this.map.flyTo({ center: coords, zoom: 14 });
  }
}
