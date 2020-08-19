import { Injectable } from '@angular/core';
import { Seat } from '../models/seat.model';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import { MovieDate } from '../models/movie.model';
import { CinemaRoom, CinemaRoomFB } from '../models/cinema.model';
import { CinemaService } from './cinema.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    public db: AngularFireDatabase
  ) {
  }

  getSeatsConfig(roomID: string, movieID: number, playingDate: MovieDate): Observable<[Seat[], [number, number]]> {
    console.log(`getSeatsConfig <<< roomID: ${roomID}, movieID: ${movieID}, playingDate: `, playingDate);
    return this.db
      .object<CinemaRoomFB>('/cinema-rooms/' + roomID)
      .valueChanges()
      .pipe(
        take(1),
        map((roomFB: CinemaRoomFB) => {
          const room = CinemaService.convertToCinemaRoom(roomFB, roomID);
          const foundMovie = room.moviesPlaying.find(movie => movie.id === movieID);
          const foundDate = foundMovie.dates.find(date => date.equals(playingDate));
          const seats = foundDate.occupiedSeats ? foundDate.occupiedSeats : [];
          console.log(`getSeatsConfig >>> seats: `, seats, `rows: ${roomFB._rows}, columns: ${roomFB._columns}`);
          return [seats, [roomFB._rows, roomFB._columns]];
        })
      );
  }

  bookSeats(cinemaRoom: CinemaRoom, movieID: number, playingDate: MovieDate, seats: Seat[]): void {
    console.log(`bookSeats <<< cinemaRoom: `, cinemaRoom, `movieID: ${movieID}`, 'playingDate: ', playingDate,
      'seats: ', seats);
    const foundMovie = cinemaRoom.moviesPlaying.find(movie => movie.id === movieID);
    const foundDate = foundMovie.dates.find(date => date.equals(playingDate));
    foundDate.occupiedSeats = seats;
    this.db.object('/cinema-rooms/' + cinemaRoom.roomID).set(cinemaRoom).then(() => {
      console.log(`bookSeats >>>`);
    });
  }


}
