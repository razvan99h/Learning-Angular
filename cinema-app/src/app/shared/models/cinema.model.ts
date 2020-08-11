import { MoviePlaying, MoviePlayingFB } from './movie.model';

export interface CinemaRoomFB {
  _name: string;
  _rows: number;
  _columns: number;
  _moviesPlaying: MoviePlayingFB[];
}

export class CinemaRoom {
  private _name: string;
  private _rows: number;
  private _columns: number;
  private _roomID: string;
  private _moviesPlaying: MoviePlaying[];

  constructor(
    name: string,
    rows: number,
    columns: number,
    roomID: string = null,
    moviesPlaying: MoviePlaying[] = [],
  ) {
    this._name = name;
    this._rows = rows;
    this._columns = columns;
    this._roomID = roomID;
    this._moviesPlaying = moviesPlaying;
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
    const foundMovie = this.moviesPlaying.find(m => m.id === movie.id);
    if (foundMovie) {
      foundMovie.dates.push(...movie.dates);
    } else {
      this.moviesPlaying.push(movie);
    }
  }

  removeMoviePlaying(movieID: number): void {
    const initialLength = this.moviesPlaying.length;
    this._moviesPlaying = this._moviesPlaying.filter(movie => movie.id !== movieID);
    if (initialLength === this.moviesPlaying.length) {
      throw Error(`Movie with movieID ${movieID} does not exist in cinema room ${this.name}!`);
    }
  }
}
