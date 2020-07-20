import { Injectable } from '@angular/core';
import { Seat } from '../models/seat.model';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    public db: AngularFireDatabase
  ) {
  }

  getBookedSeats(): Observable<Seat[]> {
    console.log(`getBookedSeats <<< `);
    return this.db
      .list<Seat>('reservations')
      .valueChanges()
      .pipe(
        map(seats => {
          console.log(`getBookedSeats >>> seats: `, seats);
          return seats;
        })
      );
  }

  bookSeats(seats: Seat[]): void {
    console.log(`bookSeats <<< seats: `, seats);
    seats.forEach(seat => {
      this.db.list('reservations').push(seat);
    });
    console.log(`bookSeats >>>`);
  }
}
