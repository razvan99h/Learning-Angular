import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CinemaRoom, CinemaRoomFB } from '../models/cinema.model';
import { MovieDate, MoviePlaying } from '../models/movie.model';
import { Seat } from '../models/seat.model';

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
          if (roomFB._moviesPlaying) {
            roomFB._moviesPlaying.forEach(movieFB => {
              const dates = movieFB._dates.map(dateFB => {
                let seats = [];
                if (dateFB._occupiedSeats) {
                  seats = dateFB._occupiedSeats.map(seatFB => new Seat(seatFB.row, seatFB.column));
                }
                return new MovieDate(dateFB.startTime, dateFB.endTime, seats);
              });
              room.addMoviePlaying(new MoviePlaying(movieFB.id, movieFB.title, movieFB.runtime, movieFB.releaseDate,
                movieFB.posterPath, movieFB.genres, dates));
            });
          }
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

  updateWithMoviePlaying(cinemaRoom: CinemaRoom, moviePlaying: MoviePlaying, dates: MovieDate[]): void {
    console.log(`updateWithMoviePlaying <<< cinemaRoom: `, cinemaRoom, `moviePlaying: `, moviePlaying, `dates: `, dates);
    dates.forEach(date => {
      moviePlaying.addDate(date);
    });
    cinemaRoom.addMoviePlaying(moviePlaying);
    this.db.object('/cinema-rooms/' + cinemaRoom.roomID).set(cinemaRoom).then(() => {
      console.log(`updateWithMoviePlaying >>>`);
    });

  }
}
