import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaResolverService implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.authService.getCurrentUser()
        .then(user => {
          if (user.email === 'admin@cmb.com') {
            resolve(true);
          } else {
            this.router.navigate(['unavailable']);
            resolve(false);
          }
        }, () => {
          this.router.navigate(['unavailable']);
          return resolve(false);
        });
    });
  }
}
