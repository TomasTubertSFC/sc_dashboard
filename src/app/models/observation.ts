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
}

export interface ObservationRelationships {
  odourSubType: OdourSubType;
  odourIntensity?: OdourIntensity;
  odourHedonicTone?: OdourHedonicTone;
  comments?: Comment[];
  user?: User;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface UserRelationships {
  profile: Profile;
}

export interface Comment {
  id: number;
  body: string;
  user_id: number | undefined;
  odour_observation_id: number;
  created_at: Date;
  user_avatar_id: number;
}
