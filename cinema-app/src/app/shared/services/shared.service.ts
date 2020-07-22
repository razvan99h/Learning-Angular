import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sourceMovieDetails = new Subject<number>();
  isHandset$: Observable<boolean>;

  getClickEventMovieDetails(): Observable<number> {
    return this.sourceMovieDetails.asObservable();
  }

  sendClickEventMovieDetails(movieID: number): void {
    this.sourceMovieDetails.next(movieID);
  }
}
