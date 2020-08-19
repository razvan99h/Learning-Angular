import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sourceMovieDetails = new Subject<number>();
  private sourceHomepage = new ReplaySubject<any>(); // better option
  private sourceLogin = new ReplaySubject<any>();

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  isHandset(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(
        map(result => {
          // console.log(result);
          return result.matches;
        }),
        // shareReplay()
      );
  }

  getClickEventMovieDetails(): Observable<number> {
    return this.sourceMovieDetails.asObservable();
  }

  sendClickEventMovieDetails(movieID: number): void {
    this.sourceMovieDetails.next(movieID);
  }

  getClickEventFromHomepage(): Observable<any> {
    return this.sourceHomepage.asObservable();
  }

  sendClickEventFromHomepage(): void {
    this.sourceHomepage.next();
  }

  getLoginInfo(): Observable<User> {
    return this.sourceLogin.asObservable();
  }

  sendLoginInfo(user: User): void {
    this.sourceLogin.next(user);
  }
}
