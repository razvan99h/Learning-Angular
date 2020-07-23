import { Injectable } from '@angular/core';
import { Seat, SeatFB } from '../models/seat.model';
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
      .list<SeatFB>('reservations')
      .valueChanges()
      .pipe(
        map(seatsFB => {
          const seats = seatsFB.map(seatFB => new Seat(seatFB.row, seatFB.column));
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
