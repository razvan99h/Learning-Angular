import { Seat } from './seat.model';
import { MoviePlaying, MovieDate } from './movie.model';

export class CinemaRoom {
  private _roomID: number;
  private _rows: number;
  private _columns: number;
  private _moviesPlaying: MoviePlaying[];
  private _occupiedSeats: Seat[];

  constructor(
    roomID: number,
    rows: number,
    columns: number,
    moviesPlaying?: MoviePlaying[],
    occupiedSeats?: Seat[]
  ) {
    this._roomID = roomID;
    this._rows = rows;
    this._columns = columns;
    this._moviesPlaying = moviesPlaying;
    this._occupiedSeats = occupiedSeats;
  }

  get roomID(): number {
    return this._roomID;
  }

  set roomID(value: number) {
    this._roomID = value;
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
      throw Error(`Invalid seat configuration for seat ${seat} in cinema room ${this.roomID}!`);
    }
    if (this._occupiedSeats.find(occupiedSeat => occupiedSeat.equals(seat))) {
      throw Error(`Seat ${seat} already occupied!`);
    }
    this._occupiedSeats.push(seat);
  }

  addMoviePlaying(movie: MoviePlaying): void {
    if (movie.dates.length === 0) {
      throw Error(`Movie ${movie.title} has no playing dates in cinema room ${this.roomID}!`);
    }
    if (this.moviesPlaying.find(moviePlaying => moviePlaying.id === movie.id)) {
      throw Error(`Movie ${movie.title} already added to cinema room ${this.roomID}!`);
    }
    movie.dates.forEach(date => {
      this.moviesPlaying.forEach(moviePlaying => {
        if (moviePlaying.dates.find(playingDate => playingDate.overlaps(date))) {
          throw Error(`The dates ${date} for movie ${movie.title} in cinema room ${this.roomID} overlap with another movie!`);
        }
      });
    });
    this.moviesPlaying.push(movie);
  }

  addDatesToMoviePlaying(movieID: number, dates: MovieDate[]): void {
    const moviePlaying = this.moviesPlaying.find(movie => movie.id === movieID);
    if (moviePlaying === undefined) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.roomID}!`);
    }
    dates.forEach(date => {
      if (moviePlaying.dates.find(playingDate => playingDate.overlaps(date))) {
        throw Error(`The dates ${date} for movie ${moviePlaying.title} in cinema room ${this.roomID} overlaps with ` +
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
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.roomID}!`);
    }
  }

  removeDateFromMoviePlaying(movieID: number, date: MovieDate): void {
    const moviePlaying = this.moviesPlaying.find(movie => movie.id === movieID);
    if (moviePlaying === undefined) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.roomID}!`);
    }
    moviePlaying.removeDate(date);
  }
}
