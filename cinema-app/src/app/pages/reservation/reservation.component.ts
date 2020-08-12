import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Movie, MovieDate } from '../../shared/models/movie.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Seat } from '../../shared/models/seat.model';
import { ReservationService } from '../../shared/services/reservation.service';
import { Subscription } from 'rxjs';
import { CinemaService } from '../../shared/services/cinema.service';
import { CinemaRoom } from '../../shared/models/cinema.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cmb-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})

export class ReservationComponent implements OnInit, OnDestroy {
  displayDays: any;
  movie: Movie;
  cinemaRows: number;
  cinemaColumns: number;
  cinemaConfig: string[][];
  selectedSeats: Seat[];
  occupiedSeats: Seat[];
  availableDates: MovieDate[];
  selectedDate = '';
  roomsNames: Map<string, string>;
  private bookedSeatsSubscription: Subscription;

  constructor(
    private reservationService: ReservationService,
    private cinemaService: CinemaService,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie,
  ) {
    this.displayDays = MovieDate.getDisplayDays();
    this.movie = data;
    this.selectedDate = '';
    this.selectedSeats = [];
    this.availableDates = [];
  }

  ngOnInit(): void {
    this.cinemaService
      .getReservationInfo(this.movie.id)
      .subscribe((response: [MovieDate[], Map<string, string>]) => {
        this.availableDates = response[0];
        this.roomsNames = response[1];
      });
  }

  filterActiveDates(dates: MovieDate[]): MovieDate[] {
    return dates.filter(date => date.isAfterToday());
  }

  selectedDateChanged(): void {
    this.getCinemaConfig(this.movie.id, this.convertToMovieDate(this.selectedDate));
  }

  createCinemaConfig(): void {
    this.cinemaConfig = [];
    for (let i = 0; i < this.cinemaColumns; i++) {
      this.cinemaConfig.push([]);
      for (let j = 0; j < this.cinemaRows; j++) {
        this.cinemaConfig[i].push('free');
      }
    }
  }

  getCinemaConfig(movieID: number, playingDate: MovieDate): void {
    this.bookedSeatsSubscription = this.reservationService
      .getSeatsConfig(playingDate.roomID, movieID, playingDate)
      .subscribe((response: [Seat[], [number, number]]) => {
          const seats = response[0];
          this.cinemaRows = response[1][0];
          this.cinemaColumns = response[1][1];
          this.createCinemaConfig();
          this.occupiedSeats = seats;
          seats.forEach(seat => {
            this.cinemaConfig[seat.row][seat.column] = 'occupied';
          });
        }
      );
  }

  selectSeat(row: number, column: number): void {
    console.log(this.cinemaConfig[row][column], row, column);
    if (this.cinemaConfig[row][column] === 'selected') {
      this.cinemaConfig[row][column] = 'free';
      this.selectedSeats = this.selectedSeats
        .filter(seat => !seat.equals(new Seat(row, column)));
    } else if (this.cinemaConfig[row][column] === 'free') {
      this.selectedSeats.push(new Seat(row, column));
      this.cinemaConfig[row][column] = 'selected';
    }
  }

  convertToMovieDate(movieDateString: string): MovieDate {
    return new MovieDate().fromJSONString(movieDateString);
  }

  movieDateDisplay(movieDateString: string): string {
    if (movieDateString === '') {
      return '';
    }
    const date = this.convertToMovieDate(movieDateString);
    return `${this.displayDays[date.getDay()]}, ${date.getStartTime()} - ${date.getEndTime()}, ` +
      `room "${this.roomsNames.get(date.roomID)}"`;
  }

  bookSeats(): void {
    this.occupiedSeats.push(...this.selectedSeats);
    const playingDate = this.convertToMovieDate(this.selectedDate);
    this.cinemaService
      .getRoom(playingDate.roomID)
      .pipe(take(1))
      .subscribe((room: CinemaRoom) => {
        this.reservationService.bookSeats(room, this.movie.id, playingDate, this.occupiedSeats);
      });
  }

  ngOnDestroy(): void {
    this.bookedSeatsSubscription.unsubscribe();
  }
}
