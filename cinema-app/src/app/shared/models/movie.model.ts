import { Image } from './image.model';
import { VideoYoutube } from './video.model';
import { environment } from '../../../environments/environment';
import { Person } from './person.model';
import { Genre } from './genre.model';
import { Company, CompanyTMDB } from './company.model';
import * as firebase from 'firebase';
import { Seat, SeatFB } from './seat.model';
import Timestamp = firebase.firestore.Timestamp;


export interface MovieTMDB {
  // tslint:disable:variable-name
  id: number;
  title: string;
  genres: Genre[];
  genre_ids: number[];
  poster_path: string;
  release_date: Date;
  runtime: number;
  vote_average: number;
  overview: string;
  revenue: number;
  budget: number;
  production_companies: CompanyTMDB[];
}

export interface MoviesTMDB {
  results: MovieTMDB[];
}


export class Movie {
  id: number;
  title: string;
  genres: Genre[];
  genreIDs: number[];
  posterPath: string;
  releaseDate: Date;
  runtime: number;
  voteAverage: number;
  overview: string;
  revenue: number;
  budget: number;
  videoYoutube: VideoYoutube;
  images: Image[];
  cast: Person[];
  crew: Person[];
  productionCompanies: Company[];


  constructor(movieTMDB?: MovieTMDB, imageSize: string = 'w300') {
    if (movieTMDB != null) {
      this.id = movieTMDB.id;
      this.title = movieTMDB.title;
      this.genres = movieTMDB.genres;
      this.genreIDs = movieTMDB.genre_ids;
      this.posterPath = movieTMDB.poster_path;
      this.releaseDate = new Date(movieTMDB.release_date);
      this.runtime = movieTMDB.runtime;
      this.voteAverage = movieTMDB.vote_average;
      this.overview = movieTMDB.overview;
      this.budget = movieTMDB.budget;
      this.revenue = movieTMDB.revenue;
      if (movieTMDB.poster_path === null) {
        this.posterPath = './assets/img/default_poster.jpg';
      } else {
        this.posterPath = environment.IMAGE_LINK + '/' + imageSize + movieTMDB.poster_path;
      }
      this.videoYoutube = new VideoYoutube();
      if (movieTMDB.production_companies != null) {
        this.productionCompanies = movieTMDB.production_companies.map(companyTMDB => new Company(companyTMDB));
      }
    }
  }
}


export interface MovieDateFB {
  roomID: string;
  startTime: Timestamp;
  endTime: Timestamp;
  occupiedSeats: SeatFB[];
}


export class MovieDate {
  roomID: string;
  startTime: Timestamp;
  endTime: Timestamp;
  occupiedSeats: Seat[];

  constructor(startTime: firebase.firestore.Timestamp = null, endTime: firebase.firestore.Timestamp = null,
              roomID: string = '', occupiedSeats: Seat[] = []) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.roomID = roomID;
    this.occupiedSeats = occupiedSeats;
  }

  static getDisplayDays(): any {
    return {
      Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday'
    };
  }

  static firstDayOfWeek(date: Date): number {
    return new Date(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
        .setDate(date.getDate() - date.getDay() + 1)
    ).getTime();
  }

  static lastDayOfWeek(date: Date): number {
    return new Date(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 21, 0, 0, 0)
        .setDate(date.getDate() - date.getDay() + 7)
    ).getTime();
  }

  isAfterToday(): boolean {
    return this.startTime.seconds > new Date().getTime() / 1000;
  }

  getDay(): string {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[this.startTime.toDate().getDay() - 1];
  }

  getDate(): string {
    const date = this.startTime.toDate().getDate();
    return (date < 10) ? '0' + date.toString() : date.toString();
  }

  getMonth(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.startTime.toDate().getMonth()];
  }

  getStartTime(): string {
    // return this.startTime.toDate().toISOString();

    return this.startTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
  }

  getEndTime(): string {
    // return this.endTime.toDate().toISOString();

    return this.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
  }

  sameWeek(other: MovieDate): boolean {
    const thisDate = this.startTime.toDate();
    const otherDate = other.startTime.toDate();
    return MovieDate.lastDayOfWeek(thisDate) === MovieDate.lastDayOfWeek(otherDate);
  }

  overlaps(other: MovieDate): boolean {
    return (other.startTime <= this.startTime && this.startTime <= other.endTime) ||
      (other.startTime <= this.endTime && this.endTime <= other.endTime) ||
      (this.startTime <= other.startTime && other.startTime <= this.endTime) ||
      (this.startTime <= other.endTime && other.endTime <= this.endTime);
  }

  equals(other: MovieDate): boolean {
    return this.startTime.isEqual(other.startTime) && this.endTime.isEqual(other.endTime) && this.roomID === other.roomID;
  }

  toJSONString(): string {
    return JSON.stringify(this);
  }

  fromJSONString(movieDateJSON: string): MovieDate {
    const obj = JSON.parse(movieDateJSON);
    this.startTime = new Timestamp(obj.startTime.seconds, obj.startTime.nanoseconds);
    this.endTime = new Timestamp(obj.endTime.seconds, obj.endTime.nanoseconds);
    this.roomID = obj.roomID;
    return this;
  }
}


export interface MoviePlayingFB {
  id: number;
  title: string;
  runtime: number;
  releaseDate: Timestamp;
  posterPath: string;
  genres: Genre[];
  voteAverage: number;
  _dates: MovieDateFB[];
}


export class MoviePlaying {
  id: number;
  title: string;
  runtime: number;
  releaseDate: Timestamp;
  posterPath: string;
  genres: Genre[];
  voteAverage: number;
  private _dates: MovieDate[];

  constructor(id: number, title: string, runtime: number, releaseDate: Timestamp, posterPath: string, genres: Genre[],
              voteAverage: number, dates: MovieDate[] = []) {
    this.id = id;
    this.title = title;
    this.runtime = runtime;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
    this.genres = genres;
    this.voteAverage = voteAverage;
    this._dates = dates;
  }

  get dates(): MovieDate[] {
    return this._dates;
  }

  // TODO: as putea sa fac un serviciu care sa arate mesajele de eroare - poate cu snackbar din angular material
  addDate(date: MovieDate): void {
    if (this._dates.find(oldDate => oldDate.overlaps(date) && oldDate.roomID === date.roomID)) {
      // apelez aici serviciul de snackbar
      throw Error(`Movie ${this.title} already playing over the selected date and time: ${date}!`);
    }
    this._dates.push(date);
  }

  removeDate(date: MovieDate): void {
    const initialLength = this._dates.length;
    this._dates = this._dates.filter(oldDate => !oldDate.equals(date));
    // TODO: trebuie dau throw de error daca nu gasesc ?
    if (initialLength === this._dates.length) {
      throw Error(`Date ${date} does not exist on movie ${this.title}!`);
    }
  }
}
