import { Point } from "./cone";
import { Observation } from "./observation";

export interface StudyZone {
  APGEMO: (Point | Point[])[];
  episodes: Episode[];
}
export interface Episode {
  id: number;
  differentUsers: number;
  date: Date;
  inconvenience: number;
  plausible: boolean;
  observations: Observation[];
}
