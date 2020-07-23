import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Seat } from '../models/seat.model';
import { map } from 'rxjs/operators';
import { CinemaRoom, CinemaRoomFB } from '../models/cinema.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  constructor(
    public db: AngularFireDatabase
  ) {
  }

  getCinemaRooms(): Observable<CinemaRoom[]> {
    console.log(`getCinemaRooms <<< `);
    return this.db
      .list<CinemaRoomFB>('cinema-rooms')
      .valueChanges()
      .pipe(
        map(roomsFB => {
          const rooms = roomsFB.map(roomFB => new CinemaRoom(roomFB._name, roomFB._rows, roomFB._columns))
          console.log(`getCinemaRooms >>> rooms: `, rooms);
          return rooms;
        })
      );
  }

  addRoom(room: CinemaRoom): void {
    console.log(`addRoom <<< room: `, room);
    this.db.list('cinema-rooms').push(room);
    console.log(`addRoom >>>`);
  }
}
