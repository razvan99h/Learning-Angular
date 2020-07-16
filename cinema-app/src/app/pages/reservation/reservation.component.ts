import { Component, Inject, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Seat } from '../../shared/models/seat.model';

@Component({
  selector: 'cmb-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  movie: Movie;
  cinemaWidth: number;
  cinemaHeight: number;
  cinemaConfig: string[][];
  selectedSeats: Seat[];
  availableDays: number[];
  days: string[];
  selectedDay: string;


  constructor(
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

    for (let i = 0; i < this.cinemaHeight; i++) {
      this.cinemaConfig.push([]);
      for (let j = 0; j < this.cinemaWidth; j++) {
        this.cinemaConfig[i].push('free');
      }
    }
    console.log(this.cinemaConfig);
  }

  ngOnInit(): void {

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

  bookTickets(): void {
    // TODO: make it do something
  }

}
