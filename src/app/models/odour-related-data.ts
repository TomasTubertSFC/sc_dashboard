export interface OdourHedonicTone {
  id: number;
  index: number;
  name: string;
  slug: string;
}

export interface OdourIntensity {
  id: number;
  name: string;
  power: number;
  slug: string;
}

export interface OdourTypeData {
  id: number;
  name: string;
  slug: string;
  relationships: {
    odourSubTypes: OdourSubType[];
  };
}

export interface OdourSubType {
  id: number;
  odourTypeId: number;
  name: string;
  slug: string;
  relationships?: { odourType: OdourTypeData };
}

