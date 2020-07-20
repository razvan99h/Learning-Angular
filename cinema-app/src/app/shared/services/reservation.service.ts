import { Injectable } from '@angular/core';
import { Seat } from '../models/seat.model';
import { Observable, of } from 'rxjs';
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
    return this.db.list<Seat>('reservations').valueChanges();
  }

  bookSeats(seats: Seat[]): void {
    seats.forEach(seat => {
      this.db.list('reservations').push(seat);
    });
  }
}
