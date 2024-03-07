import {
  OdourHedonicTone,
  OdourIntensity,
  OdourSubType,
} from './odour-related-data';
import { User, Profile } from './user';

//La observación principal
export interface Observation {
  id: number;
  color:number,
  latitude: number;
  longitude: number;
  relationships: ObservationRelationships;
  likes: number;
  liked: boolean;
  description: null | string;
  origin: null | string;
  createdAt: string;
  updatedAt: string;
  plausible: boolean;
  APGEMOdistance: number;
}

export interface ObservationRelationships {
  odourSubType: OdourSubType;
  odourIntensity?: OdourIntensity;
  odourHedonicTone?: OdourHedonicTone;
  user?: User;
  wind: Wind;
}

export interface Wind {
  deg: number,
  speed: number,
}
