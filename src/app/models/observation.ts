import { withHttpTransferCacheOptions } from '@angular/platform-browser';
import {
  OdourHedonicTone,
  OdourIntensity,
  OdourSubType,
} from './odour-related-data';
import { User } from './user';


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

export interface ObservationGeoJson {

  type: string;
  id: number;
  properties: {
    id: number;
    color: number;
    plausible: boolean;
    APGEMOdistance: number;
    description: string | null;
    origin: string | null;
    hedonicTone: number;
    intensity: number;
    createdAt: string;
    userId: number | null | undefined;
    windDeg: number | null | undefined;
    windSpeed: number | null | undefined;

  };
  geometry: {
    type: string;
    coordinates: number[];
  };

}

//La observación principal
export class Observation {
  id: number;
  color:number;
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
  geoJson: ObservationGeoJson | null = null;

  constructor(
    observation: Observation

  ) {
    this.id = observation.id;
    this.color = observation.color;
    this.latitude = observation.latitude;
    this.longitude = observation.longitude;
    this.relationships = observation.relationships;
    this.likes = observation.likes;
    this.liked = observation.liked;
    this.description = observation.description;
    this.origin = observation.origin;
    this.createdAt = observation.createdAt;
    this.updatedAt = observation.updatedAt;
    this.plausible = observation.plausible;
    this.APGEMOdistance = observation.APGEMOdistance;
    this.getObservationGeoJson();
  }

  public getObservationGeoJson() {

    this.geoJson = {
      type: "Feature",
      id: this.id,
      properties: {
        id: this.id,
        color: this.color,
        plausible: this.plausible,
        APGEMOdistance: this.APGEMOdistance,
        description: this.description,
        origin: this.origin,
        hedonicTone: this.relationships.odourHedonicTone?.index? this.relationships.odourHedonicTone.index : 0,
        intensity: this.relationships.odourIntensity?.power? this.relationships.odourIntensity.power : 0,
        createdAt: this.createdAt,
        userId: this.relationships.user? this.relationships.user.id : null,
        windDeg: this.relationships.wind?.deg,
        windSpeed: this.relationships.wind?.speed,
      },
      geometry: {
        type: "Point",
        coordinates: [this.longitude, this.latitude]
      }
    };

  }

}
