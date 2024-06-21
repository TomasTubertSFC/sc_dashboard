import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable, map, filter, switchMap } from 'rxjs';
import { Observations, ObservationsDataChart } from '../../models/observations';
import { MapObservation } from '../../models/map';
import * as turf from '@turf/turf';

export interface Feature<G extends GeoJSON.Geometry | null = GeoJSON.Geometry, P = { [name: string]: any } | null> extends turf.GeoJSONObject {
  type: "Feature";
  geometry: G;
  id?: string | number | undefined;
  properties: P;
}

@Injectable({
  providedIn: 'root',
})
export class ObservationsService {
  observations$: BehaviorSubject<Observations[]> = new BehaviorSubject<
    Observations[]
  >([]);

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  public getAllObservations(): void {
    this.http
      .get<{ success: string; data: Observations[] }>(
        `${environment.BACKEND_BASE_URL}/observations`
      )
      .subscribe(({ data }) => {

        //TODO: esto debería hacerse en el backend
        data.map((obs) => {
          //modificamos el path para añadir un número de coordenadas random cerca de las coordenadas de la observación (obs.attributes.latitude, obs.attributes.longitude)
          obs.attributes.path = [];
          let start!: [number, number];
          for (let i = 0; i < Math.floor(Math.random() * (10 - 3 + 1) + 3); i++) {

            let end: [number, number] = [Number(obs.attributes.longitude) + Math.random() * 0.0005, Number(obs.attributes.latitude) + Math.random() * 0.0005];
            if(i == 0) start = [Number(obs.attributes.longitude) + Math.random() * 0.0005, Number(obs.attributes.latitude) + Math.random() * 0.0005];

            obs.attributes.path.push({
              start:  start,
              end:    end,
              parameters:{
                pause:  Math.random() < 0.2 ? true : false,
                LAeq:   Math.floor(Math.random() * 140),
                LAeqT:  Math.floor(Math.random() * 140),
                L10:    Math.floor(Math.random() * 140),
                L90:    Math.floor(Math.random() * 140)
              }
            });

            start = end;
          }
          return obs;
        });

        this.observations$.next(data);
        this.loading$.next(false);

      });
  }

  public getAllObservationsNumbers(): Observable<any> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) => {

        const observationsByUser: { [key: string]: {[key:number]:number} } =
          observations.reduce((acc, obs) => {
            const userId = obs.relationships.user.id;
            if (!acc[userId]) {
              acc[userId] = Array.from({ length: 12 }, (_, i) => i + 1).reduce(
                (acc, month) => ({ ...acc, [month]: 0 }),
                {}
              );
            }
            const month = new Date(obs.attributes.created_at).getMonth() + 1;
            acc[userId][month]++;
            return acc;
          }, {} as { [key: string]: {[key:number]:number} });


        const numberOfDifferentUsers = Object.keys(observationsByUser).length;
        const totalObservations = observations.length;

        const averageObservationsPerUserPerMonth = (totalObservations / 12 / numberOfDifferentUsers);

        const observationsByAge = {
          '<18': 0,
          '18-30': 0,
          '30-40': 0,
          '40-50': 0,
          '>50': 0,
        };
        const observationsByUserGender = {
          male: 0,
          female: 0,
          others: 0,
          'non-binary': 0,
          'prefer-not-to-say': 0,
          null: 0,
        };

        const uniqueUserProfiles = Object.keys(observationsByUser).map(
          (userId) => {
            const userProfile = observations.find(
              (obs) => obs.relationships.user.id === userId
            )?.relationships.user.attributes.profile;
            const birthYear = userProfile?.birthYear as number;
            const year = new Date().getFullYear();
            const yearsOld = year - birthYear;
            return { ...userProfile, yearsOld };
          }
        );

        uniqueUserProfiles.forEach((user) => {
          if (user.yearsOld < 18) {
            observationsByAge['<18']++;
          } else if (user.yearsOld >= 18 && user.yearsOld < 30) {
            observationsByAge['18-30']++;
          } else if (user.yearsOld >= 30 && user.yearsOld < 40) {
            observationsByAge['30-40']++;
          } else if (user.yearsOld >= 40 && user.yearsOld < 50) {
            observationsByAge['40-50']++;
          } else {
            observationsByAge['>50']++;
          }
        });
        uniqueUserProfiles.forEach((user) => {
          switch (user.gender) {
            case 'male':
              observationsByUserGender.male++;
              break;
            case 'female':
              observationsByUserGender.female++;
              break;
            case 'others':
              observationsByUserGender.others++;
              break;
            case 'prefer-not-to-say':
              observationsByUserGender['prefer-not-to-say']++;
              break;
            case 'non-binary':
              observationsByUserGender['non-binary']++;
              break;
            default:
              observationsByUserGender.null++;
              break;
          }
        });

        return {
          numberOfDifferentUsers,
          totalObservations,
          averageObservationsPerUserPerMonth,
          observationsByGender: Object.entries(observationsByUserGender).map(
            ([genre, value]) => ({ genre, value })
          ),
          observationsByAge: Object.entries(observationsByAge).map(
            ([age, value]) => ({ age, value })
          ),
        };
      })
    );
  }

  public getAllMapObservations(): Observable<MapObservation[]> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) => //TODO: Actualizar con la información que necesito ahora para el popUp
        observations.map((obs) => ({
          id: obs.id,
          user_id: obs.relationships.user.id,
          latitude: obs.attributes.latitude,
          longitude: obs.attributes.longitude,
          created_at: new Date(obs.attributes.created_at),
          types: obs.relationships.types.map((type) => type.id),
          LAeq: obs.attributes.LAeq,
          userType: obs.relationships.user.type,
          quiet: obs.attributes.quiet,
          path: obs.attributes.path
        }))
      )
    );
  }

  public getAllObservationsFormated(): Observable<ObservationsDataChart[]> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) => {
        const arrOfDaysObservationsCout = observations
          .sort(
            (a, b) =>
              new Date(a.attributes.created_at).getTime() -
              new Date(b.attributes.created_at).getTime()
          )
          .reduce(
            (
              acc: {
                [key: string]: {
                  date: string;
                  obs: Observations[];
                  count: number;
                };
              },
              obs
            ) => {
              const key = obs.attributes.created_at.split(' ')[0];
              if (!acc[key]) {
                acc[key] = {
                  date: obs.attributes.created_at,
                  obs: [],
                  count: 0,
                };
              }
              acc[key].obs.push(obs);
              acc[key].count++;
              return acc;
            },
            {}
          );

        const arrOfDays = Object.values(arrOfDaysObservationsCout);
        let firstDay = new Date(arrOfDays[0].date);
        let lastDay = new Date(arrOfDays[arrOfDays.length - 1].date);

        let currentDate = new Date(firstDay.setHours(0, 0, 0, 0));
        let endDay = new Date(lastDay.setHours(0, 0, 0, 0));
        let allDays = [];

        while (currentDate <= endDay) {
          const dayValue = arrOfDays.find((value) => {
            const valueDate = new Date(value.date).setHours(0, 0, 0, 0);
            return valueDate === currentDate.getTime();
          });
          if (!!dayValue) {
            allDays.push({
              ...dayValue,
              completeDay: new Date(dayValue.date),
              date: dayValue.date.split(' ')[0],
            });
          } else {
            const day = currentDate.toISOString().split('T')[0];
            allDays.push({
              count: 0,
              obs: [],
              completeDay: new Date(currentDate),
              date: day,
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return allDays;
      })
    );
  }

  public getAllObservationsByRegion(): Observable<{
    geojson: any;
    values: { name: string; value: number }[];
  }> {
    return this.observations$.pipe(
      filter((value) => value.length > 0),
      switchMap((observations) => {
        const catalunyaGeoJsonUrl =
          '../../../assets/shapefiles_catalunya_comarcas.geojson';
        return this.http.get<any>(catalunyaGeoJsonUrl).pipe(
          map((catalunyaGeoJson) => {
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

  public getLinsStringFromObservations(observations: Observations[] = this.observations$.getValue()): Feature[] | null {

    if(observations.length == 0) return null;

    function getColor(value: number): string{
      switch (true) {
        case value <= 35:
          return '#B7CE8E';
        case value > 35 && value <= 40:
          return '#1D8435';
        case value > 40 && value <= 45:
          return '#0E4C3C';
        case value > 45 && value <= 50:
          return '#ECD721';
        case value > 50 && value <= 55:
          return '#9F6F2C';
        case value > 55 && value <= 60:
          return '#EF7926';
        case value > 60 && value <= 65:
          return '#C71932';
        case value > 65 && value <= 70:
          return '#8D1A27';
        case value > 70 && value <= 75:
          return '#88497B';
        case value > 75 && value <= 80:
          return '#18558C';
        case value > 80:
          return '#134367';
        default:
          return '#333';
      }
    }

    //Crear polilineas para las observaciones, esto añade el borde negro a las observaciones para mejorar la visibilidad

    let linestrings:Feature[] = observations.map((obs) => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: obs.attributes.path.map((value) => { return value.start })
      },
      properties: {
        id:     obs.id,
        type:   'LineString',
        color:  '#333',
        width:  6
      }
    }));

    //Obtener los segmentos de las polilineas
    linestrings = linestrings.concat(
      observations.map((obs) => {
        let segments:Feature[] = [];
        for (let i = 0; i < obs.attributes.path.length - 1; i++) {
          segments.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [obs.attributes.path[i].start, obs.attributes.path[i].end]
            },
            properties: {
              type:   'Line',
              color: getColor(obs.attributes.path[i].parameters.LAeq),
              width: 3,
              pause: obs.attributes.path[i].parameters.pause
            }
          });
        }
        return segments;
      }).flat()
    );
    return linestrings;

  }



  public getFilteredObservationsForSoundscape(minHour: number | null = null, maxHour: number | null = null, polygon: number[][]){
    this.observations$.pipe(
      filter((value) => value.length > 0),
      map((observations) => {
        const polygonTurf = turf.polygon([polygon]);
        return observations.filter((obs) => {
          let point = turf.point([
            Number(obs.attributes.longitude),
            Number(obs.attributes.latitude),
          ]);
          const isInside = turf.booleanPointInPolygon(point, polygonTurf);
          if (isInside) {
            if (minHour && maxHour) {
              const hour = new Date(obs.attributes.created_at).getHours();
              return hour >= minHour && hour <= maxHour;
            }
            return true;
          }
          return false;
        });
      })
    ).subscribe((filteredObservations) => {
      this.observations$.next(filteredObservations);
    });
  }

}
