import { Injectable } from '@angular/core';
import { Seat } from '../models/seat.model';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private dummySeats: Seat[];

  constructor(
    public db: AngularFireDatabase
  ) {
    const seats = [];
    seats.push(new Seat(1, 1));
    seats.push(new Seat(1, 0));
    seats.push(new Seat(0, 5));
    this.dummySeats = seats;
  }

  getBookedSeats(): Observable<Seat[]> {
    console.log("xxxxxxxx", this.dummySeats);

    return new Observable<Seat[]>(observer => {
      observer.next(this.dummySeats);
      return observer;
    });
  }

  bookSeats(seats: Seat[]): void {
    this.dummySeats.push(...seats);
    console.log("ddddddddd", this.dummySeats);
  }
}
