import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Movie } from '../models/movie.model';

import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { MoviesDTO } from '../models/moviesDTO.model';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) {
  }

  getMovie(id: number): Observable<Movie> {
    console.log(`getMovie --- method entered: id = ${id}`);
    const url = environment.MOVIES_LINK + '/' + id + '?api_key=' + environment.API_KEY;
    return this.httpClient.get<Movie>(url).pipe(
      map(result => {
        console.log('getMovie --- method finished: result = ', result);
        return result;
      }));
  }

  getAllMovies(): Observable<MoviesDTO> {
    console.log('getAllMovies --- method entered');
    const url = environment.MOVIES_LINK + '/now_playing?api_key=' + environment.API_KEY;
    return this.httpClient.get<MoviesDTO>(url).pipe(
      map(result => {
        console.log('getAllMovies --- method finished: result = ', result);
        return result;
      }));
  }
}
