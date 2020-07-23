import { Seat, SeatFB } from './seat.model';
import { MoviePlaying, MovieDate, MoviePlayingFB } from './movie.model';

export interface CinemaRoomFB {
  _name: string;
  _rows: number;
  _columns: number;
  _moviesPlaying: MoviePlayingFB[];
  _occupiedSeats: SeatFB[];
}

export class CinemaRoom {
  private _name: string;
  private _rows: number;
  private _columns: number;
  private _roomID: string;
  private _moviesPlaying: MoviePlaying[];
  private _occupiedSeats: Seat[];

  constructor(
    name: string,
    rows: number,
    columns: number,
    roomID?: string,
    moviesPlaying?: MoviePlaying[],
    occupiedSeats?: Seat[]
  ) {
    this._name = name;
    this._rows = rows;
    this._columns = columns;
    this._roomID = roomID === undefined ? null : roomID;
    this._moviesPlaying = moviesPlaying === undefined ? null : moviesPlaying;
    this._occupiedSeats = occupiedSeats === undefined ? null : occupiedSeats;
  }


  get roomID(): string {
    return this._roomID;
  }

  set roomID(value: string) {
    this._roomID = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get rows(): number {
    return this._rows;
  }

  set rows(value: number) {
    this._rows = value;
  }

  get columns(): number {
    return this._columns;
  }

  set columns(value: number) {
    this._columns = value;
  }

  get moviesPlaying(): MoviePlaying[] {
    return this._moviesPlaying;
  }

  get occupiedSeats(): Seat[] {
    return this._occupiedSeats;
  }

  addSeat(seat: Seat): void {
    if (seat.column > this.columns || seat.row > this.rows) {
      throw Error(`Invalid seat configuration for seat ${seat} in cinema room ${this.name}!`);
    }
    if (this._occupiedSeats.find(occupiedSeat => occupiedSeat.equals(seat))) {
      throw Error(`Seat ${seat} already occupied!`);
    }
    this._occupiedSeats.push(seat);
  }

  addMoviePlaying(movie: MoviePlaying): void {
    if (movie.dates.length === 0) {
      throw Error(`Movie ${movie.title} has no playing dates in cinema room ${this.name}!`);
    }
    if (this.moviesPlaying.find(moviePlaying => moviePlaying.id === movie.id)) {
      throw Error(`Movie ${movie.title} already added to cinema room ${this.name}!`);
    }
    movie.dates.forEach(date => {
      this.moviesPlaying.forEach(moviePlaying => {
        if (moviePlaying.dates.find(playingDate => playingDate.overlaps(date))) {
          throw Error(`The dates ${date} for movie ${movie.title} in cinema room ${this.name} overlap with another movie!`);
        }
      });
    });
    this.moviesPlaying.push(movie);
  }

  addDatesToMoviePlaying(movieID: number, dates: MovieDate[]): void {
    const moviePlaying = this.moviesPlaying.find(movie => movie.id === movieID);
    if (moviePlaying === undefined) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.name}!`);
    }
    dates.forEach(date => {
      if (moviePlaying.dates.find(playingDate => playingDate.overlaps(date))) {
        throw Error(`The dates ${date} for movie ${moviePlaying.title} in cinema room ${this.name} overlaps with ` +
          `already existent date for that movie!`);
      }
    });
    dates.forEach(date => {
      moviePlaying.addDate(date);
    });
  }

  removeMoviePlaying(movieID: number): void {
    const initialLength = this.moviesPlaying.length;
    this._moviesPlaying = this._moviesPlaying.filter(movie => movie.id !== movieID);
    // TODO: ar trebui sa arunc eroare daca nu exista elementul care sa fie sters?
    if (initialLength === this.moviesPlaying.length) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.name}!`);
    }
  }

  removeDateFromMoviePlaying(movieID: number, date: MovieDate): void {
    const moviePlaying = this.moviesPlaying.find(movie => movie.id === movieID);
    if (moviePlaying === undefined) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.name}!`);
    }
    moviePlaying.removeDate(date);
  }
}
