import { Injectable } from '@angular/core';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleResolverService implements Resolve<CinemaRoom> {

  constructor(
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CinemaRoom> | Promise<CinemaRoom> | CinemaRoom {
    const roomID = route.paramMap.get('id');
    return undefined;
  }
}
