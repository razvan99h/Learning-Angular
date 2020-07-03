import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {Movie} from '../models/movie.model';

import {GlobalVariable} from '../../../globals';

import {Observable, from} from 'rxjs';

import {map, flatMap, mergeMap} from 'rxjs/operators';
import {MoviesDTO} from '../models/moviesDTO.model';


@Injectable()
export class MovieService {

  constructor(private httpClient: HttpClient) {
  }

  getMovie(id: number): Observable<Movie> {
    console.log(`getMovie ---- method entered: id = ${id}`);
    const url = GlobalVariable.MOVIES_LINK + '/' + id;
    return this.httpClient.get<Movie>(url).pipe(
      map(result => {
        console.log('getMovie --- method finished: result = ', result);
        return result;
      }));
  }

  getAllMovies(): Observable<MoviesDTO> {
    console.log('getAllMovies --- method entered');
    const url = GlobalVariable.MOVIES_LINK + '/now_playing?api_key=' + GlobalVariable.API_KEY;
    return this.httpClient.get<MoviesDTO>(url).pipe(
      map(result => {
        console.log('getAllMovies --- method finished: result = ', result);
        return result;
      }));
  }
}
