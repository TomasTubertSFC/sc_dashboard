import { Point } from "./cone";

export interface Episode {
  date: Date;
  intensity: number;
  APGEMO: Point[];
  observations: Point[];
}
