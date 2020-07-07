export class Movie {
  // tslint:disable:variable-name
  id: number;
  title: string;
  genres: Array<string>;
  genre_ids: Array<number>;
  poster_path: string;
  release_date: Date;
  runtime: number;
}
