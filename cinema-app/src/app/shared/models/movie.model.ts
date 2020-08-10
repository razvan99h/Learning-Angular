import { Image } from './image.model';
import { VideoYoutube } from './video.model';
import { environment } from '../../../environments/environment';
import { Person } from './person.model';
import { Genre } from './genre.model';
import { Company, CompanyTMDB } from './company.model';
import * as firebase from 'firebase';
import { Seat, SeatFB } from './seat.model';
import { CinemaRoom } from './cinema.model';
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
  similarMovies: Movie[];
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

export interface MovieDateOldFB {
  _day: string;
  _startHour: number;
  _startMinute: number;
  _endHour: number;
  _endMinute: number;
}

export class MovieDateOld {
  private _day: string;
  private _startHour: number;
  private _startMinute: number;
  private _endHour: number;
  private _endMinute: number;

  constructor(day: string, startHour: number, startMinute: number, endHour: number, endMinute: number) {
    MovieDateOld.validateDay(day);
    MovieDateOld.validateHour(startHour);
    MovieDateOld.validateHour(endHour);
    MovieDateOld.validateMinute(startMinute);
    MovieDateOld.validateMinute(endMinute);
    this._day = day;
    this._startHour = startHour;
    this._startMinute = startMinute;
    this._endHour = endHour;
    this._endMinute = endMinute;
  }

  private static validateDay(day: string): void {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (days.indexOf(day.toLocaleLowerCase()) === -1) {
      throw Error(`${day} is an invalid day name!`);
    }
  }

  private static validateHour(hour: number): void {
    if (hour < 0 || hour > 23) {
      throw Error(`${hour} is an invalid hour!`);
    }
  }

  private static validateMinute(minute: number): void {
    if (minute < 0 || minute > 60) {
      throw Error(`${minute} is an invalid minute!`);
    }
  }

  get day(): string {
    return this._day;
  }

  set day(value: string) {
    MovieDateOld.validateDay(value);
    this._day = value;
  }

  get startHour(): number {
    return this._startHour;
  }

  set startHour(value: number) {
    MovieDateOld.validateHour(value);
    this._startHour = value;
  }

  get startMinute(): number {
    return this._startMinute;
  }

  set startMinute(value: number) {
    MovieDateOld.validateMinute(value);
    this._startMinute = value;
  }

  get endHour(): number {
    return this._endHour;
  }

  set endHour(value: number) {
    MovieDateOld.validateHour(value);
    this._endHour = value;
  }

  get endMinute(): number {
    return this._endMinute;
  }

  set endMinute(value: number) {
    MovieDateOld.validateMinute(value);
    this._endMinute = value;
  }

  equals(other: MovieDateOld): boolean {
    return this.day === other.day && this.startHour === other.startHour && this.startMinute === other.startMinute &&
      this.endHour === other.endHour && this.endMinute === other.endMinute;
  }

  overlaps(other: MovieDateOld): boolean {
    if (this.day === other.day) {
      if (this.startHour <= other.startHour && other.startHour <= this.endHour) {
        // TODO: more logic could be added here, regarding overlapping minutes
        return true;
      }
      if (this.startHour <= other.endHour && other.endHour <= this.endHour) {
        // and here
        return true;
      }
    }
    return false;
  }
}

export interface MovieDateFB {
  startTime: Timestamp;
  endTime: Timestamp;
  _occupiedSeats: SeatFB[];

}

export class MovieDate {
  startTime: Timestamp;
  endTime: Timestamp;
  private _occupiedSeats: Seat[];


  constructor(startTime: firebase.firestore.Timestamp = null, endTime: firebase.firestore.Timestamp = null,
              occupiedSeats: Seat[] = []) {
    this.startTime = startTime;
    this.endTime = endTime;
    this._occupiedSeats = occupiedSeats;
  }

  getDay(): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[this.startTime.toDate().getDay() - 1];
  }

  getStartTime(): string {
    return this.startTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
  }

  getEndTime(): string {
    return this.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
  }

  overlaps(other: MovieDate): boolean {
    return (other.startTime <= this.startTime && this.startTime <= other.endTime) ||
      (other.startTime <= this.endTime && this.endTime <= other.endTime);
  }

  equals(other: MovieDate): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }

  toJSONString(): string {
    return JSON.stringify(this);
  }

  fromJSONString(movieDateJSON: string): MovieDate {
    const obj = JSON.parse(movieDateJSON);
    this.startTime = new Timestamp(obj.startTime.seconds, obj.startTime.nanoseconds);
    this.endTime = new Timestamp(obj.endTime.seconds, obj.endTime.nanoseconds);
    return this;
  }

  get occupiedSeats(): Seat[] {
    return this._occupiedSeats;
  }

  addSeat(seat: Seat, cinemaRoom: CinemaRoom): void {
    if (seat.column > cinemaRoom.columns || seat.row > cinemaRoom.rows) {
      throw Error(`Invalid seat configuration for seat ${seat} in cinema room ${cinemaRoom.name}!`);
    }
    if (this._occupiedSeats.find(occupiedSeat => occupiedSeat.equals(seat))) {
      throw Error(`Seat ${seat} already occupied!`);
    }
    this._occupiedSeats.push(seat);
  }
}

export interface MoviePlayingFB {
  id: number;
  title: string;
  runtime: number;
  releaseDate: Timestamp;
  posterPath: string;
  genres: Genre[];
  _dates: MovieDateFB[];
}

export class MoviePlaying {
  id: number;
  title: string;
  runtime: number;
  releaseDate: Timestamp;
  posterPath: string;
  genres: Genre[];
  private _dates: MovieDate[];

  constructor(id: number, title: string, runtime: number, releaseDate: Timestamp, posterPath: string, genres: Genre[],
              dates: MovieDate[] = []) {
    this.id = id;
    this.title = title;
    this.runtime = runtime;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
    this.genres = genres;
    this._dates = dates;
  }

  get dates(): MovieDate[] {
    return this._dates;
  }

  // TODO: as putea sa fac un serviciu care sa arate mesajele de eroare - poate cu snackbar din angular material
  addDate(date: MovieDate): void {
    if (this._dates.find(oldDate => oldDate.overlaps(date))) {
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
