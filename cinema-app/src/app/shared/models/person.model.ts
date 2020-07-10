import { environment } from '../../../environments/environment';

export interface PersonTMDB {
  // tslint:disable:variable-name
  id: number;
  name: string;
  character: string;
  department: string;
  job: string;
  profile_path: string;
}

export interface PersonsTMDB {
  cast: PersonTMDB[];
  crew: PersonTMDB[];
}

export class Persons {
  cast: Person[];
  crew: Person[];
}

export class Person {
  id: number;
  name: string;
  character: string;
  department: string;
  job: string;
  profilePath: string;

  constructor(personTMDB?: PersonTMDB, imageSize: string = '/w300') {
    this.id = personTMDB.id;
    this.name = personTMDB.name;
    this.character = personTMDB.character;
    this.department = personTMDB.department;
    this.job = personTMDB.job;
    if (personTMDB.profile_path != null) {
      this.profilePath = environment.IMAGE_LINK + imageSize + personTMDB.profile_path;
    } else {
      this.profilePath = 'assets/img/default_profile.png';
    }
  }
}
