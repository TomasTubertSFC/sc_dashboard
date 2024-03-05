import { Point } from "./cone";
import { Observation } from "./observation";

export interface StudyZone {
  APGEMO: Point[];
  episodes: Episode[];
}
export interface Episode {
  date: Date;
  inconvenience: number;
  observations: Observation[];
  id: number
}
