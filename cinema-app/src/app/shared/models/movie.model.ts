import { Image } from './image.model';
import { VideoYoutube } from './video.model';
import { environment } from '../../../environments/environment';
import { Person } from './person.model';
import { Genre } from './genre.model';
import { Company, CompanyTMDB } from './company.model';

export interface MovieTMDB {
  // tslint:disable:variable-name
  id: number;
  title: string;
  genres: Genre[];
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


  constructor(movieTMDB?: MovieTMDB, imageSize: string = '/w300') {
    if (movieTMDB != null) {
      this.id = movieTMDB.id;
      this.title = movieTMDB.title;
      this.genres = movieTMDB.genres;
      this.posterPath = movieTMDB.poster_path;
      this.releaseDate = new Date(movieTMDB.release_date);
      this.runtime = movieTMDB.runtime;
      this.voteAverage = movieTMDB.vote_average;
      this.overview = movieTMDB.overview;
      this.budget = movieTMDB.budget;
      this.revenue = movieTMDB.revenue;
      if (movieTMDB.poster_path == null) {
        this.posterPath = './assets/img/default_poster.jpg';
      } else {
        this.posterPath = environment.IMAGE_LINK + imageSize + movieTMDB.poster_path;
      }
      this.videoYoutube = new VideoYoutube();
      if (movieTMDB.production_companies != null) {
        this.productionCompanies = movieTMDB.production_companies.map(companyTMDB => new Company(companyTMDB));
      }
    }
  }
}
