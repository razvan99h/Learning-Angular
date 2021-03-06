import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { VideoYoutube } from '../../shared/models/video.model';
import { Image } from '../../shared/models/image.model';
import { Persons } from '../../shared/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailsResolverService implements Resolve<Movie> {

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Movie> | Observable<never> {
    const movieID = Number(route.paramMap.get('id'));
    return this.movieService
      .getMovie(movieID)
      .pipe(
        // we create an Observable<Movie> from the first call (1) of the .getMovie()'s subscribe
        take(1),
        mergeMap(movie => {
          const movieToShow = movie;
          if (movie) {
            return this.movieService
              .getMovieData(movieID)
              .pipe(
                // we create an Observable<Movie> from the first call (1) of the .getMovieData()'s subscribe
                take(1),
                map((response: [VideoYoutube, Image[], Persons]) => {
                  const videoYoutube = response[0];
                  const images = response[1];
                  const persons = response[2];

                  movieToShow.videoYoutube = videoYoutube;
                  movieToShow.images = images;
                  movieToShow.cast = persons.cast;
                  movieToShow.crew = persons.crew;
                  return movieToShow;
                })
              );
          } else {
            // movie not found
            this.router.navigate(['unavailable']);
            return EMPTY;
          }
        }),
        catchError(error => {
          console.error(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        })
      );
  }
}
