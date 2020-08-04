import { Component, Inject, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../../shared/models/cinema.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaService } from '../../../../../shared/services/cinema.service';
import { Movie, MovieDate } from '../../../../../shared/models/movie.model';
import { FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import { MovieService } from '../../../../../shared/services/movie.service';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'cmb-cinema-movie-add',
  templateUrl: './cinema-movie-add.component.html',
  styleUrls: ['../../cinema-list-details-base.component.scss', './cinema-movie-add.component.scss']
})
export class CinemaMovieAddComponent implements OnInit {
  room: CinemaRoom;
  movies: Movie[];
  currentPage = 1;
  genres: Map<number, string>;
  selectedMovie = -1;
  availableDays: string[];
  selectedDays = new FormControl();
  availableTimes: MovieDate[];
  displayTimes: MovieDate[];

  constructor(
    private cinemaService: CinemaService,
    private movieService: MovieService,
    @Inject(MAT_DIALOG_DATA) private data: {
      room: CinemaRoom,
      movies: Movie[],
      genres: Map<number, string>
    }
  ) {
    this.room = data.room;
    this.movies = data.movies;
    this.genres = data.genres;

    // TODO: fetch this from a service
    this.availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.availableTimes = [
      new MovieDate(new Timestamp(1596542400, 0), new Timestamp(1596549600, 0)),
      new MovieDate(new Timestamp(1596628800, 0), new Timestamp(1596636000, 0))
    ];
    this.displayTimes = [];
  }

  ngOnInit(): void {

  }

  clickMovie(index: number): void {
    this.selectedMovie = index;
  }

  updateAvailableTimes(): void {
    console.log(this.selectedDays.value);
    this.availableTimes.forEach(time => {
      console.log('dayyy', time.getDay());
      if (this.selectedDays.value.includes(time.getDay())) {
        this.displayTimes.push(time);
      }
    });
    console.log(this.displayTimes);
  }

  showLess(): void {
    this.currentPage -= 1;
    for (let i = 1; i <= 20; i++) {
      this.movies.pop();
    }
  }

  showMore(): void {
    this.currentPage += 1;
    this.movieService
      .getAllMovies(this.currentPage)
      .subscribe((movies: Movie[]) => {
        this.movies.push(...movies);
      });
  }
}
