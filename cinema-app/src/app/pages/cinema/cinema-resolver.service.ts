import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CinemaResolverService implements CanActivate{

  constructor(
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
    // TODO: do it with firebase
    if (localStorage.getItem('email') === 'admin@cmb.com' && localStorage.getItem('password') === 'password1') {
      return true;
    } else {
      this.router.navigate(['unavailable']);
      return false;
    }
  }
}
