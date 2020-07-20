import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Seat } from '../../shared/models/seat.model';
import { ReservationService } from '../../shared/services/reservation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cmb-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
// TODO: read about encapsulation

export class ReservationComponent implements OnInit, OnDestroy {
  movie: Movie;
  cinemaWidth: number;
  cinemaHeight: number;
  cinemaConfig: string[][];
  selectedSeats: Seat[];
  occupiedSeats: Seat[];
  availableDays: number[];
  days: string[];
  selectedDay: string;
  private bookedSeatsSubscription: Subscription;


  constructor(
    public reservationService: ReservationService,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie,
  ) {
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.movie = data;
    this.selectedSeats = [];
    this.selectedDay = '';

    // TODO: fetch data from elsewhere
    this.cinemaConfig = [];
    this.cinemaWidth = 15;
    this.cinemaHeight = 7;
    this.availableDays = [0, 1, 3, 6];

    this.createCinemaConfig();
  }

  ngOnInit(): void {
    this.getOccupiedSeats();
  }

  createCinemaConfig(): void {
    for (let i = 0; i < this.cinemaHeight; i++) {
      this.cinemaConfig.push([]);
      for (let j = 0; j < this.cinemaWidth; j++) {
        this.cinemaConfig[i].push('free');
      }
    }
  }

  freeCinemaConfig(): void {
    for (let i = 0; i < this.cinemaHeight; i++) {
      for (let j = 0; j < this.cinemaWidth; j++) {
        this.cinemaConfig[i][j] = 'free';
      }
    }
  }

  getOccupiedSeats(): void {
    this.bookedSeatsSubscription = this.reservationService
      .getBookedSeats()
      .subscribe(
        seats => {
          this.cinemaConfig = this.cinemaConfig.map(row =>
            row.map(seatState => 'free')
          );
          seats.forEach(seat => {
            this.cinemaConfig[seat.row][seat.column] = 'occupied';
          });
        }
      );
  }

  selectSeat(row: number, column: number): void {
    // console.log(this.config[row][column], row, column);
    if (this.cinemaConfig[row][column] === 'selected') {
      this.cinemaConfig[row][column] = 'free';
      this.selectedSeats = this.selectedSeats
        .filter(seat => !seat.equals(new Seat(row, column)));
    } else if (this.cinemaConfig[row][column] === 'free') {
      this.selectedSeats.push(new Seat(row, column));
      this.cinemaConfig[row][column] = 'selected';
    }
  }

  bookSeats(): void {
    this.reservationService.bookSeats(this.selectedSeats);
  }

  ngOnDestroy(): void {
    this.bookedSeatsSubscription.unsubscribe();
  }
}
