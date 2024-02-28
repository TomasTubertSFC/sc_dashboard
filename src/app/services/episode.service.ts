import { Injectable } from '@angular/core';
import { Episode } from '../models/episode';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private _episode: BehaviorSubject<Episode | null> = new BehaviorSubject<Episode | null>(null);
  public get episode(): BehaviorSubject<Episode | null> {
    return this._episode;
  }
  public set episode(value: Episode) {
    this._episode.next(value);
  }

  private _observation: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public get observation(): BehaviorSubject<number | null> {
    return this._observation;
  }
  public set observation(value: number | null) {
    this._observation.next(value);
  }

  constructor() { }
}
