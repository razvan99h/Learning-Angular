import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { MoviePlaying } from '../../shared/models/movie.model';
import { CinemaService } from '../../shared/services/cinema.service';

@Injectable({
  providedIn: 'root'
})
export class HomepageResolverService implements Resolve<MoviePlaying[]> {

  constructor(
    private cinemaService: CinemaService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MoviePlaying[]>{
    return this.cinemaService
      .getAllMoviesPlayingThisWeek()
      .pipe(
        take(1),
        map((moviesPlaying: MoviePlaying[]) => {
          return moviesPlaying;
        }),
        catchError((error) => {
          console.error(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        }),
      );
  }
}
