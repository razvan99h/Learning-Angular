import { Component, Inject, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cmb-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  movie: Movie;
  cinemaWidth = 20;
  cinemaHeight = 13;
  config: string[][];
  selected: [number, number][];

  constructor(
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {
    this.movie = data;
    this.selected = [];

    // TODO: fetch data from elsewhere
    this.config = [];

    for (let i = 0; i < this.cinemaHeight; i++) {
      this.config.push([]);
      for (let j = 0; j < this.cinemaWidth; j++) {
        this.config[i].push('free');
      }
    }
    console.log(this.config);
  }

  ngOnInit(): void {
  }

  selectSeat(row: number, column: number): void {
    console.log(this.config[row][column], row, column);
    if (this.config[row][column] === 'selected') {
      this.config[row][column] = 'free';
      delete this.selected[this.selected.indexOf([row, column])];
    } else if (this.config[row][column] === 'free') {
      this.selected.push([row, column]);
      this.config[row][column] = 'selected';
    }
  }

  bookTickets(): void {
    // TODO: make it do something
  }
}
