export interface Observations {
    type:          string;
    id:            string;
    attributes:    ObservationsAttributes;
    relationships: ObservationsRelationships;
}

export interface ObservationsDataChart {
    date: string;
    obs: Observations[];
    count: number;
  }

export interface ObservationsAttributes {
    Leq:                    string;
    LAeqT:                  string[] | string;
    LAmax:                  string;
    LAmin:                  string;
    L90:                    string;
    L10:                    string;
    sharpness_S:            string;
    loudness_N:             string;
    roughtness?:            string;
    fluctuation_strength_F: string;
    images:                 string[];
    latitude:               string;
    longitude:              string;
    quiet:                  null | string;
    cleanliness:            null | string;
    accessibility:          null | string;
    safety:                 null | string;
    influence:              null | string;
    landmark:               null | string;
    protection:             null | string;
    wind_speed:             string;
    humidity:               number | null;
    temperature:            string;
    pressure:               number | string;
    user_id:                string;
    created_at:             string;
    updated_at:             Date;
    roughtness_R?:          string;
}

export interface ObservationsRelationships {
    user:  User;
    types: ObservationsType[];
}

export interface ObservationsType {
    id:          number | string;
    name:        string;
    description: string;
}

interface User {
    type:          string;
    id:            string;
    attributes:    UserAttributes;
    relationships: [];
}

interface UserAttributes {
    avatar_id:  string;
    profile:    Profile;
    created_at: Date;
    updated_at: Date;
}

interface Profile {
    gender:    string;
    birthYear: number | string;
}