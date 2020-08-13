import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { forkJoin, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

  private static getFreeDatesFromThisWeek(occupiedMinutes: number): MovieDate[] {
    const now = new Date();
    const freeDates = [];
    const firstDayOfWeek = MovieDate.firstDayOfWeek(new Date());

    let counter = 0;
    while (true) {
      const newStartTime = firstDayOfWeek + 1000 * 1800 * counter;
      const newEndTime = newStartTime + occupiedMinutes * 1000 * 60;
      if (newStartTime > MovieDate.lastDayOfWeek(now)) {
        break;
      }
      const newStartDate = new Date(newStartTime);
      const newEndDate = new Date(newEndTime);
      if (newStartDate.getHours() >= 12 && newEndDate.getHours() < 23 && newStartDate.getDate() === newEndDate.getDate()) {
        freeDates.push(new MovieDate(
          new Timestamp(newStartTime / 1000, 0),
          new Timestamp(newEndTime / 1000, 0)
        ));
      }
      counter += 1;
    }
    return freeDates;
  }

  static convertToCinemaRoom(roomFB: CinemaRoomFB, roomID: string): CinemaRoom {
    const room = new CinemaRoom(roomFB._name, roomFB._rows, roomFB._columns, roomID);
    if (roomFB._moviesPlaying) {
      roomFB._moviesPlaying.forEach(movieFB => {
        const dates = movieFB._dates.map(dateFB => {
          let seats = [];
          if (dateFB.occupiedSeats) {
            seats = dateFB.occupiedSeats.map(seatFB => new Seat(seatFB.row, seatFB.column));
          }
          const startTime = new Timestamp(dateFB.startTime.seconds, dateFB.startTime.nanoseconds);
          const endTime = new Timestamp(dateFB.endTime.seconds, dateFB.endTime.nanoseconds);
          return new MovieDate(startTime, endTime, dateFB.roomID, seats);
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
        map((roomsObj: CinemaRoomFB[]) => {
          const rooms = Object.entries(roomsObj).map(([key, roomFB]) => {
            return CinemaService.convertToCinemaRoom(roomFB, key);
          });
          console.log(`getCinemaRooms >>> rooms: `, rooms);
          return rooms;
        })
      );
  }

  getCinemaRoomsNames(): Observable<Map<string, string>> {
    console.log(`getCinemaRoomsNames <<< `);
    return this.db
      .object('cinema-rooms')
      .valueChanges()
      .pipe(
        take(1),
        map((roomsObj: CinemaRoomFB[]) => {
          const names = new Map<string, string>();
          Object.entries(roomsObj).forEach(([key, roomFB]) => {
            names.set(key, roomFB._name);
          });
          console.log(`getCinemaRoomsNames >>> names: `, names);
          return names;
        })
      );
  }

  getRoom(roomID: string): Observable<CinemaRoom> {
    console.log(`getRoom <<< roomID: ${roomID}`);
    return this.db
      .object<CinemaRoomFB>('/cinema-rooms/' + roomID)
      .valueChanges()
      .pipe(
        map((roomFB: CinemaRoomFB) => {
          const room = CinemaService.convertToCinemaRoom(roomFB, roomID);
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

  getAllMoviesPlayingThisWeek(): Observable<MoviePlaying[]> {
    console.log(`getAllMoviesPlayingThisWeek <<<`);
    return this
      .getCinemaRooms()
      .pipe(
        map((rooms: CinemaRoom[]) => {
          let movies: MoviePlaying[] = [];
          rooms.forEach(room => {
            room.moviesPlaying.forEach(moviePlaying => {
              const foundMovie = movies.find(movie => movie.id === moviePlaying.id);
              if (foundMovie) {
                moviePlaying.dates.forEach(date => {
                  foundMovie.addDate(date);
                });
              } else {
                movies.push(moviePlaying);
              }
            });
          });
          const now = new MovieDate(new Timestamp(new Date().getTime() / 1000, 0));
          movies = movies.filter(movie =>
            movie.dates.find(date => date.sameWeek(now) && date.startTime.seconds > now.startTime.seconds)
          );
          movies = movies.sort((m1, m2) => m2.voteAverage - m1.voteAverage);
          console.log(`getAllMoviesPlayingThisWeek >>> moviesPlaying:`, movies);
          return movies;
        })
      );
  }

  checkIfMoviePlays(movieID: number): Observable<boolean> {
    console.log(`checkIfMoviePlays <<< movieID: ${movieID}`);
    return this
      .getCinemaRooms()
      .pipe(
        take(1),
        map((rooms: CinemaRoom[]) => {
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
    console.log(`addMoviePlaying <<< cinemaRoom: `, cinemaRoom, `moviePlaying: `, moviePlaying, `dates: `, dates);
    dates.forEach(date => {
      moviePlaying.addDate(date);
    });
    cinemaRoom.addMoviePlaying(moviePlaying);
    this.db.object('/cinema-rooms/' + cinemaRoom.roomID).set(cinemaRoom).then(() => {
      console.log(`addMoviePlaying >>>`);
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
    const freeDates = CinemaService.getFreeDatesFromThisWeek(occupiedMinutes);
    const availableDates = [];

    freeDates.forEach(freeDate => {
      let overlaps = false;
      cinemaRoom.moviesPlaying.forEach(moviePlaying => {
        moviePlaying.dates.forEach(movieDate => {
          if (freeDate.overlaps(movieDate)) {
            overlaps = true;
          }
        });
      });
      if (!overlaps) {
        availableDates.push(freeDate);
      }
    });
    console.log(`getAvailableDates >>> availableDates:`, availableDates);
    return availableDates;
  }

  getPlayingDatesThisWeek(movieID: number): Observable<MovieDate[]> {
    console.log(`getPlayingDatesThisWeek <<<`);
    return this
      .getAllMoviesPlayingThisWeek()
      .pipe(
        take(1),
        map((moviesPlaying: MoviePlaying[]) => {
          const moviePlaying = moviesPlaying.find(movie => movie.id === movieID);
          let playingDates = [];
          if (moviePlaying) {
            const now = new MovieDate(new Timestamp(new Date().getTime() / 1000, 0));
            playingDates = moviePlaying.dates.filter(date => date.sameWeek(now));
          }
          console.log(`getPlayingDatesThisWeek >>> playingDates:`, playingDates);
          return playingDates;
        })
      );
  }

  getReservationInfo(movieID: number): Observable<[MovieDate[], Map<string, string>]> {
    const response1 = this.getPlayingDatesThisWeek(movieID);
    const response2 = this.getCinemaRoomsNames();
    return forkJoin([response1, response2]);
  }
}
