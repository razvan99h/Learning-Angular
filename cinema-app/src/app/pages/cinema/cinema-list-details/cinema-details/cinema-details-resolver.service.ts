import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { MovieService } from '../../../../shared/services/movie.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaDetailsResolverService implements Resolve<any[]> {

  constructor(
    private router: Router,
    private cinemaService: CinemaService,
    private movieService: MovieService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>{
    const roomID = route.paramMap.get('id');
    const response1 =  this.cinemaService
      .getRoom(roomID)
      .pipe(
        take(1),
        map(room => {
          return room;
        }),
        catchError(error => {
          console.log(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        })
      );
    const response2 = this.movieService
      .getAllGenres()
      .pipe(
        take(1),
        map(genres => {
          return genres;
        }),
        catchError(error => {
          console.log(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        })
      );
    return forkJoin([response1, response2]);
  }
}
