import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable, map, filter, switchMap } from 'rxjs';
import { Observations, ObservationsDataChart } from '../../models/observations';
import { Feature, MapObservation } from '../../models/map';
import * as turf from '@turf/turf';

@Injectable({
  providedIn: 'root',
})
export class ObservationsService {
  observations$: BehaviorSubject<Observations[]> = new BehaviorSubject<
    Observations[]
  >([]);

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get observations(): Observations[] {
    return this.observations$.getValue();
  }

  constructor(private http: HttpClient) {}

  public getAllObservations(): void {
    this.http
      .get<{ success: string; data: Observations[] }>(
        `${environment.BACKEND_BASE_URL}/observations`
      )
      .subscribe(({ data }) => {
        this.observations$.next(data);
        this.loading$.next(false);
      });
  }

  public getAllMapObservations(): Observable<MapObservation[]> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) =>
        observations.map((obs) => ({
          id: obs.id,
          user_id: obs.relationships.user.id,
          latitude: obs.attributes.latitude,
          longitude: obs.attributes.longitude,
          created_at: new Date(obs.attributes.created_at),
          types: obs.relationships.types.map((type) => type.id),
          Leq: obs.attributes.Leq,
          userType: obs.relationships.user.type,
          quiet: obs.attributes.quiet,
        }))
      )
    );
  }

  public getAllObservationsFormated(): Observable<ObservationsDataChart[]> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) => {
        const arrGroupObsByDays = observations.reduce(
          (
            acc: {
              [key: string]: { date: Date; obs: Observations[]; count: number };
            },
            observation,
            idx
          ) => {
            const splitedDate = observation.attributes.created_at
              .split(' ')[0]
              .split('-');
            const formatedDate = new Date(
              Number(splitedDate[0]),
              Number(splitedDate[1]) - 1,
              Number(splitedDate[2])
            );
            const key = formatedDate.toDateString(); // Convert the date to a string for use as the index
            if (!acc[key]) {
              acc[key] = { date: formatedDate, obs: [], count: 0 };
            }
            acc[key].obs.push(observation);
            return acc;
          },
          {}
        );
        const arrSorted = Object.values(arrGroupObsByDays)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((obs) => ({
            ...obs,
            count: obs.obs.length,
          }));
        return arrSorted;
      })
    );
  }

  // public getAllObservationsByRegion(): Observable<any> {
  //   return this.observations$.pipe(
  //     filter((value) => value.length > 0),
  //     map((observations) => {
  //       const catalunyaGeoJsonUrl = '../../../assets/shapefiles_catalunya_comarcas.geojson'
  //       let catalunyaGeoJson;
  //       this.http.get<any>(catalunyaGeoJsonUrl).subscribe((geoJson) => {
  //         catalunyaGeoJson = geoJson;
  //       });
  //       console.log('catalunyaGeoJson', catalunyaGeoJson)
  //       // observations.map((obs) => ({
  //       //   let point = turf.point([Number(obs.attributes.longitude), Number(obs.attributes.latitude)])

  //       // }))
  //     }
  //     )
  //   );
  // }

  public getAllObservationsByRegion(): Observable<any> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      switchMap((observations) => {
        const catalunyaGeoJsonUrl =
          '../../../assets/shapefiles_catalunya_comarcas.geojson';
        return this.http.get<any>(catalunyaGeoJsonUrl).pipe(
          map((catalunyaGeoJson) => {
            //Por cada comarca quiero que encuentre las observaciones que le tocan
            const values = catalunyaGeoJson.features.map((comarca: any) => {
              const obsCount = observations.filter((obs) => {
                let point = turf.point([
                  Number(obs.attributes.longitude),
                  Number(obs.attributes.latitude),
                ]);
                const isInside = turf.booleanPointInPolygon(point, comarca);
                return isInside;
              }).length;
              return {
                name: comarca.properties.name,
                value: obsCount,
              };
            });
            return {
              geojson: catalunyaGeoJson,
              values: values,
            };
          })
        );
      })
    );
  }
}
