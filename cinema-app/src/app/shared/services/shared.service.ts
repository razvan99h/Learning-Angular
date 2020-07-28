import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sourceMovieDetails = new Subject<number>();

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  getClickEventMovieDetails(): Observable<number> {
    return this.sourceMovieDetails.asObservable();
  }

  sendClickEventMovieDetails(movieID: number): void {
    this.sourceMovieDetails.next(movieID);
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
}
