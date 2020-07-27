import { Injectable } from '@angular/core';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { CinemaService } from '../../../shared/services/cinema.service';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CinemaListResolverService implements Resolve<CinemaRoom[]> {

  constructor(
    private cinemaService: CinemaService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CinemaRoom[]>{
    return this.cinemaService
      .getCinemaRooms()
      .pipe(
        take(1),
        map((rooms: CinemaRoom[]) => {
          return rooms;
        }),
        catchError(error => {
          console.log(error);
          this.router.navigate(['unavailable']);
          return EMPTY;
        })
      );
  }
}
