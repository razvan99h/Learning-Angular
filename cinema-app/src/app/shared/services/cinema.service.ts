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
}
