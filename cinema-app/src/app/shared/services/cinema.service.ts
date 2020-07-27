import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
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
      .object('cinema-rooms')
      .valueChanges()
      .pipe(
        map(roomsObj => {
          const rooms = Object.entries(roomsObj).map(([key, roomFB]) => {
            return new CinemaRoom(roomFB._name, roomFB._rows, roomFB._columns, key);
          });
          console.log(`getCinemaRooms >>> rooms: `, rooms);
          return rooms;
        })
      );
  }

  getRoom(roomID: string): Observable<CinemaRoom> {
    console.log(`getRoom <<< roomID: ${roomID}`);
    return this.db
      .object<CinemaRoomFB>('/cinema-rooms/' + roomID)
      .valueChanges()
      .pipe(
        map(roomFB => {
          const room = new CinemaRoom(roomFB._name, roomFB._rows, roomFB._columns);
          console.log(`getRoom >>> room: `, room);
          return room;
        })
      );
  }

  addRoom(room: CinemaRoom): void {
    console.log(`addRoom <<< room: `, room);
    this.db.list('cinema-rooms').push(room).then(() => {
      console.log(`addRoom >>>`);
    });
  }

  editRoom(roomID: string, newRoom: CinemaRoom): void {
    console.log(`editRoom <<< roomID: ${roomID}, newRoom: `, newRoom);
    this.db.object('/cinema-rooms/' + roomID).set(newRoom).then(() => {
      console.log(`editRoom >>>`);
    });
  }

  removeRoom(roomID: string): void {
    console.log(`removeRoom <<< roomID: `, roomID);
    this.db.object('/cinema-rooms/' + roomID).remove().then(() => {
      console.log(`removeRoom >>>`);
    });
  }
}
