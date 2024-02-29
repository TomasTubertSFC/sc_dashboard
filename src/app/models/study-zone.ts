import { Point } from "./cone";

export interface StudyZone {
  APGEMO: Point[];
  episodes: Episode[];
}
export interface Episode {
  date: Date;
  intensity: number;
  observations: Point[];
}
