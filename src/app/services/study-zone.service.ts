import { Injectable } from '@angular/core';
import { Episode, StudyZone } from '../models/study-zone';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observation } from '../models/observation';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudyZoneService {

  public studyZoneId: number | undefined | null;
  private isLoggedIn!: boolean;

  public plausibilityDistance: number = 350;
  public plausibilityWindSpeed: number = 0.5;
  public plausibilityMinOKObservations: number = 1;

  private _studyZoneModal = new BehaviorSubject<boolean>(false);

  set studyZoneModal(value: any) {
    this._studyZoneModal.next(value);
  }
  get studyZoneModal(): Observable<boolean> {
    return this._studyZoneModal;
  }

  private _studyZone: BehaviorSubject<StudyZone | null> = new BehaviorSubject<StudyZone | null>(null);
  public get studyZone(): BehaviorSubject<StudyZone | null> {
    return this._studyZone;
  }
  public set studyZone(value: StudyZone | null) {
    this._studyZone.next(value);
  }

  private _episode: BehaviorSubject<Episode | null> = new BehaviorSubject<Episode | null>(null);
  public get episode(): BehaviorSubject<Episode | null> {
    return this._episode;
  }
  public set episode(value: Episode | null) {
    this._episode.next(value);
  }

  private _previewEpisode: BehaviorSubject<Episode | null> = new BehaviorSubject<Episode | null>(null);
  public get previewEpisode(): BehaviorSubject<Episode | null> {
    return this._previewEpisode;
  }
  public set previewEpisode(value: Episode | null) {
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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    ) {

      this.authService.isLoggedIn.subscribe((isLoggedIn) => {
        if(!this.isLoggedIn && isLoggedIn === true){
          this.isLoggedIn = isLoggedIn;
          this.getStudyZoneFromLocalStorage();
        }
        this.isLoggedIn = true;
      });
    }

  // private getDataAPIweather(latitude: number, longitude: number) {
  //   let APIkey = '1c1d95b41745d75a14ef0bf37040c0ad';
  //   this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`).subscribe(data => {
  //       this.dataAPIweather = data;
  //     }
  //   );
  // }


  private getColorOfInconvenience(inconvenience: number): number {
    let base100 = Math.round(inconvenience / 7 * 100);
    switch (true) {
      case(base100 <= 18) : return 1;
      case(base100 > 18 && base100 <= 35 ) : return 2;
      case(base100 > 35 && base100 <= 68) : return 3;
      default: return 4;
    }
  }

  private calculateEpisodePlausibility(episode: Episode): void{
    let plausible = false;
    episode.observations.forEach((observation) => {
      this.calculateObservationPlausibility(observation);
      if(observation.plausible){
        plausible = true;
      }

    });
    episode.plausible = plausible;
  }

  private calculateObservationPlausibility(observation: Observation): void{
    if(observation.APGEMOdistance <= this.plausibilityDistance || observation.relationships.wind.speed <= this.plausibilityWindSpeed) observation.plausible = true;
    else observation.plausible = false;
  }

  public getStudyZoneFromLocalStorage(): void {

    let id = Number(localStorage.getItem('studyZoneId'));
    if(id){
      this.studyZoneId = id;
    }

    if(this.isLoggedIn){

      if(this.studyZoneId){
        this.getStudyZone(id);
        this.studyZoneModal = false;
      }
      else{
        this.studyZoneModal = true;
      }
    }

  }

  public getStudyZoneById(id:number): void {

    this.studyZoneId = undefined;
    this.getStudyZone(id);
    this.studyZoneModal = false;

  }

  private getStudyZone(id: number): void {

    if(this.studyZone !== null) this.studyZone = null;

    setTimeout(() => {

      this.http.get<StudyZone>(`/assets/data/study-zone${id}.json`).pipe<StudyZone>(
        map((studyZone: StudyZone) => {

          studyZone.episodes.map((episode: Episode, index:number) => {

            episode.id = index

            if(!episode.inconvenience){
              episode.inconvenience = 0;
              episode.observations.forEach((observation) => {
                episode.inconvenience += observation.color/episode.observations.length;
              })
            }
            this.calculateEpisodePlausibility(episode);
            if(!episode.participation) episode.participation = 3;
            episode.inconvenienceColor = this.getColorOfInconvenience(episode.inconvenience);
            episode.plausible = episode.plausible || false;
            episode.observations = episode.observations.map((observation) => {
              observation.plausible = observation.plausible || false;
              return new Observation(observation);
            });
            return episode;

          })
          studyZone.restObservations = studyZone.restObservations.map((observation) => {
            return new Observation(observation);
          });

          this.studyZoneId = id;
          localStorage.setItem('studyZoneId', id.toString());

          return studyZone;

        })
      ).subscribe(data => {
        this.studyZone = data;
      });

    }, 1000);
  }

  public getStudyZoneList(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/study-zone-list.json');
  }

}
