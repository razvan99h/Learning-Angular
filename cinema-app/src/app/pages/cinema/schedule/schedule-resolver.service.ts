import { Injectable } from '@angular/core';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { CinemaService } from '../../../shared/services/cinema.service';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleResolverService implements Resolve<CinemaRoom> {

  constructor(
    private router: Router,
    private cinemaService: CinemaService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CinemaRoom> | Promise<CinemaRoom> | CinemaRoom {
    const roomID = route.paramMap.get('id');
    return this.cinemaService
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
  }
}
