import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable, map, filter } from 'rxjs';
import { Observations } from '../../models/observations';
import { MapObservation } from '../../models/map';

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

  constructor(private http: HttpClient) {
  }

  public getAllObservations(): Observable<{
    success: string;
    data: Observations[];
  }> {
    return this.http.get<{ success: string; data: Observations[] }>(
      `${environment.BACKEND_BASE_URL}/observations`
    );
  }
  public getAllObservationsT(): void {
    this.http
      .get<{ success: string; data: Observations[] }>(
        `${environment.BACKEND_BASE_URL}/observations`
      )
      .subscribe(({ data }) => {
        this.observations$.next(data);
        this.loading$.next(false);
        console.log('done');
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
}
