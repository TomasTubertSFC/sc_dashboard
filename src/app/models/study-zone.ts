import { Point } from "./cone";

export interface StudyZone {
  APGEMO: Point[];
  episodes: Episode[];
}
export interface Episode {
  date: Date;
  inconvenience: number;
  observations: Point[];
  id: number
}
export interface Observation {
  id: number;
  date: Date;
  inconvenience: number;
  coordiantes: Point;
}
