import { Point } from './cone';
import { Observation } from './observation';

export interface StudyZone {
  initDate: string;
  endDate: string;
  APGEMO: (Point | Point[])[];
  episodes: Episode[];
  restObservations: Observation[];
}
export interface Episode {
  id: number;
  type: OdourType;
  subtype: OdourType;
  differentUsers: number;
  date: Date;
  inconvenience: number;
  inconvenienceColor: number;
  participation: number;
  plausible: boolean;
  observations: Observation[];
}

export interface OdourType {
  name: string;
  id: number;
}
