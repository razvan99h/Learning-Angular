import { Injectable } from '@angular/core';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { CinemaService } from '../../../shared/services/cinema.service';
import { catchError, mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CinemaListResolverService implements Resolve<CinemaRoom[]> {

  constructor(
    private cinemaService: CinemaService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CinemaRoom[]> | Promise<CinemaRoom[]> | CinemaRoom[] {
    return this.cinemaService
      .getCinemaRooms()
      .pipe(
        take(1),
        mergeMap((rooms: CinemaRoom[]) => {
          return of(rooms);
        }),
        catchError(error => {
          console.log(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        })
      );
  }
}
