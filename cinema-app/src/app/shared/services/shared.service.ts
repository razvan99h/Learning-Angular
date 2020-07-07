import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // TODO: cum e mai bine sa trimit: id prin link sau asa?
  private sourceMovieDetails = new Subject<number>();

  getClickEventMovieDetails(): Observable<number> {
    return this.sourceMovieDetails.asObservable();
  }

  sendClickEventMovieDetails(movieID: number): void {
    this.sourceMovieDetails.next(movieID);
  }
}
