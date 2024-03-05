import { Observation } from "./observation";

export class User {

  id:                     undefined | number;
  email:                  string;
  avatar_id:              number;
  password?:              undefined | string;
  password_confirmation?: undefined | string;
  relationships:          Relationships

  constructor(element: any){
    this.id                                 = element.id;
    this.email                              = element.email;
    this.avatar_id                          = element.avatar_id;
    this.password                           = element.password;
    this.password_confirmation              = element.password_confirmation;
    this.relationships                      = element.relationships;
  }

}

export interface Relationships {
  profile:           Profile;
  odourObservations:  Observation[];
}

export interface Profile {
  type:       string;
  name:       string;
  surname:    string | null;
  gender:     string;
  birth_year:  number;
  phone:      string | null;
  avatar_id:  number;
  isTrained:  boolean;
  level:      number;
}

export function createDummyUser(): User {

  const dummyProfile: Profile = {
    type: 'dummy',
    name: 'Dummy',
    surname: null,
    gender: 'male',
    birth_year: 1900,
    phone: null,
    avatar_id: 1,
    isTrained: true,
    level: 2,
  };

  const dummyRelationships: Relationships = {
    profile: dummyProfile,
    odourObservations: [],
  };

  const dummyUser: User = {
    id: 1,
    email: 'dummy@example.com',
    avatar_id: 1,
    password: undefined,
    password_confirmation: undefined,
    relationships: dummyRelationships,
  };

  return dummyUser;
}

export interface SingUpUser {
  email: string;
  password: string;
  password_confirmation: string;
  name:       string;
  gender:     string;
  birthYear:  number;
}

export function createDummySingUpUser(): SingUpUser {
  const dummySingUpUser: SingUpUser = {
    email: 'dummy@example.com',
    password: '123123123',
    password_confirmation: '123123123',
    name: 'Dummy',
    gender: 'Mujer',
    birthYear: 1990,
  };
  return dummySingUpUser;
}

