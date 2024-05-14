import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observations } from '../../models/observations';

@Injectable({
  providedIn: 'root',
})
export class ObservationsService {
  observations$: BehaviorSubject<Observations[]> = new BehaviorSubject<
    Observations[]
  >([]);

  get observations(): Observations[] {
    return this.observations$.getValue();
  }

  //TODO VER QUE HAGO CON ESTO
  constructor(private http: HttpClient) {
    this.getAllObservations();
  }

  public getAllObservations(): void {
    this.http
      .get<{ success: string; data: Observations[] }>(
        `${environment.BACKEND_BASE_URL}/observations`
      )
      .subscribe(({ data }) => {
        this.observations$.next(data);
      });
  }
}
