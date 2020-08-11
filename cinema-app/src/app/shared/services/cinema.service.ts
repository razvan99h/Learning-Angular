import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CinemaRoom, CinemaRoomFB } from '../models/cinema.model';
import { MovieDate, MoviePlaying } from '../models/movie.model';
import { Seat } from '../models/seat.model';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  constructor(
    public db: AngularFireDatabase
  ) {
  }

  private static getFreeDatesFromNow(occupiedMinutes: number): MovieDate[] {
    const now = new Date();
    const freeDates = [];
    const firstFreeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);

    let counter = 0;
    while (true) {
      const newStartTime = firstFreeDate.getTime() + 1000 * 1800 * counter;
      const newEndTime = newStartTime + occupiedMinutes * 1000 * 60;
      const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6, 21, 0, 0, 0);
      if (newStartTime > lastDayOfWeek.getTime()) {
        break;
      }
      const newStartDate = new Date(newStartTime);
      const newEndDate = new Date(newEndTime);
      if (newStartDate.getHours() > 10 && newEndDate.getHours() < 23 && newStartDate.getDate() === newEndDate.getDate()) {
        freeDates.push(new MovieDate(
          new Timestamp(newStartTime / 1000, 0),
          new Timestamp(newEndTime / 1000, 0)
        ));
      }
      counter += 1;
    }
    return freeDates;
  }

  private convertToCinemaRoom(roomFB: CinemaRoomFB, roomID: string): CinemaRoom {
    const room = new CinemaRoom(roomFB._name, roomFB._rows, roomFB._columns, roomID);
    if (roomFB._moviesPlaying) {
      roomFB._moviesPlaying.forEach(movieFB => {
        const dates = movieFB._dates.map(dateFB => {
          let seats = [];
          if (dateFB._occupiedSeats) {
            seats = dateFB._occupiedSeats.map(seatFB => new Seat(seatFB.row, seatFB.column));
          }
          const startTime = new Timestamp(dateFB.startTime.seconds, dateFB.startTime.nanoseconds);
          const endTime = new Timestamp(dateFB.endTime.seconds, dateFB.endTime.nanoseconds);
          return new MovieDate(startTime, endTime, seats);
        });
        const releaseDate = new Timestamp(movieFB.releaseDate.seconds, movieFB.releaseDate.nanoseconds);
        room.addMoviePlaying(new MoviePlaying(movieFB.id, movieFB.title, movieFB.runtime, releaseDate,
          movieFB.posterPath, movieFB.genres, movieFB.voteAverage, dates));
      });
    }
    return room;
  }

  getCinemaRooms(): Observable<CinemaRoom[]> {
    console.log(`getCinemaRooms <<< `);
    return this.db
      .object('cinema-rooms')
      .valueChanges()
      .pipe(
        map(roomsObj => {
          const rooms = Object.entries(roomsObj).map(([key, roomFB]) => {
            return this.convertToCinemaRoom(roomFB, key);
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
          const room = this.convertToCinemaRoom(roomFB, roomID);
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

  getAllMoviesPlaying(): Observable<MoviePlaying[]> {
    console.log(`getAllMoviesPlaying <<<`);
    return this
      .getCinemaRooms()
      .pipe(
        map(rooms => {
          const movies = [];
          for (const room of rooms) {
            movies.push(...room.moviesPlaying);
          }
          console.log(`getAllMoviesPlaying >>> moviesPlaying: ${movies}`);
          return movies;
        })
      );
  }

  checkIfMoviePlays(movieID: number): Observable<boolean> {
    console.log(`checkIfMoviePlays <<< movieID: ${movieID}`);
    return this
      .getCinemaRooms()
      .pipe(
        map(rooms => {
          let result = false;
          for (const room of rooms) {
            for (const movie of room.moviesPlaying) {
              if (movie.id === movieID) {
                result = true;
              }
            }
          }
          console.log(`checkIfMoviePlays >>> result: ${result}`);
          return result;
        })
      );
  }

  addMoviePlaying(cinemaRoom: CinemaRoom, moviePlaying: MoviePlaying, dates: MovieDate[]): void {
    console.log(`updateWithMoviePlaying <<< cinemaRoom: `, cinemaRoom, `moviePlaying: `, moviePlaying, `dates: `, dates);
    dates.sort((date1, date2) => date1.startTime.seconds - date2.startTime.seconds);
    dates.forEach(date => {
      moviePlaying.addDate(date);
    });
    cinemaRoom.addMoviePlaying(moviePlaying);
    this.db.object('/cinema-rooms/' + cinemaRoom.roomID).set(cinemaRoom).then(() => {
      console.log(`updateWithMoviePlaying >>>`);
    });
  }

  removeMoviePlaying(movieID: number, cinemaRoom: CinemaRoom): void {
    console.log(`removeMoviePlaying <<< movieID: ${movieID}, cinemaRoom: `, cinemaRoom);
    cinemaRoom.removeMoviePlaying(movieID);
    this.db.object('/cinema-rooms/' + cinemaRoom.roomID).set(cinemaRoom).then(() => {
      console.log(`removeMoviePlaying >>>`);
    });
  }

  getAvailableDates(runtime: number, cinemaRoom: CinemaRoom): MovieDate[] {
    console.log(`getAvailableDates <<< runtime: ${runtime}, cinemaRoom: `, cinemaRoom);
    const occupiedMinutes = (Math.floor(runtime / 30) + 1 + ((runtime % 30 > 0) ? 1 : 0)) * 30;
    const freeDates = CinemaService.getFreeDatesFromNow(occupiedMinutes);
    const availableDates = [];

    freeDates.forEach(freeDate => {
      let overlaps = false;
      cinemaRoom.moviesPlaying.forEach(moviePlaying => {
        moviePlaying.dates.forEach(movieDate => {
          if (freeDate.overlaps(movieDate)) {
            overlaps = true;
            console.log("overlaps", freeDate, movieDate);
          }
        });
      });
      if (!overlaps) {
        availableDates.push(freeDate);
      }
    });
    console.log(availableDates, freeDates);
    console.log(`getAvailableDates >>> availableDates:`, availableDates);
    return availableDates;
  }
}
