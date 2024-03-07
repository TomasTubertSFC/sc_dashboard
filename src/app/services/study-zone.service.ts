import { Injectable } from '@angular/core';
import { Episode, StudyZone } from '../models/study-zone';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudyZoneService {

  private _studyZone: BehaviorSubject<StudyZone | null> = new BehaviorSubject<StudyZone | null>(null);
  public get studyZone(): BehaviorSubject<StudyZone | null> {
    return this._studyZone;
  }
  public set studyZone(value: StudyZone) {
    this._studyZone.next(value);
  }

  private _episode: BehaviorSubject<Episode | null> = new BehaviorSubject<Episode | null>(null);
  public get episode(): BehaviorSubject<Episode | null> {
    return this._episode;
  }
  public set episode(value: Episode) {
    this._episode.next(value);
  }

  private _previewEpisode: BehaviorSubject<Episode | null> = new BehaviorSubject<Episode | null>(null);
  public get previewEpisode(): BehaviorSubject<Episode | null> {
    return this._previewEpisode;
  }
  public set previewEpisode(value: Episode|null) {
    this._previewEpisode.next(value);
  }

  private _observation: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public get observation(): BehaviorSubject<number | null> {
    return this._observation;
  }
  public set observation(value: number | null) {
    this._observation.next(value);
  }

  private _previewObservation: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public get previewObservation(): BehaviorSubject<number | null> {
    return this._previewObservation;
  }
  public set previewObservation(value: number|null) {
    this._previewObservation.next(value);
  }

  constructor(private http: HttpClient) {
    this.http.get<StudyZone>('/assets/data/study-zone.json').pipe<StudyZone>(
      map((studyZone: StudyZone) => {
        studyZone.episodes.map((episode: Episode, index:number) => {
          episode.id = index
          episode.plausible = episode.plausible || false;
          episode.observations.map((observation, index) => {
            observation.plausible = observation.plausible || false;
          });
          return episode;
        })
        return studyZone;
      })
    ).subscribe(data => {
      this.studyZone = data;
    });
  }
}
