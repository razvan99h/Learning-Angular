import { Component, Inject, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../../shared/models/cinema.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaService } from '../../../../../shared/services/cinema.service';
import { Movie, MovieDate, MoviePlaying } from '../../../../../shared/models/movie.model';
import { MovieService } from '../../../../../shared/services/movie.service';
import * as firebase from 'firebase';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  movie: Movie;

  displayDaysNames: any;
  selectedDays: string[];

  disabledTimes: MovieDate[];
  availableTimes: MovieDate[];
  availableDatesMap: Map<string, MovieDate[]>;
  displayTimes: MovieDate[][];
  selectedTimes: string[];

  form: FormGroup;
  selectedWeeks = 1;
  weeks: number[];

  constructor(
    private cinemaService: CinemaService,
    private movieService: MovieService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: {
      room: CinemaRoom,
      movies: Movie[],
      genres: Map<number, string>
    }
  ) {
    this.weeks = new Array(10).fill(0).map((_, i) => i);
    this.room = data.room;
    this.movies = data.movies;
    this.genres = data.genres;

    this.displayDaysNames = MovieDate.getDisplayDaysNames();
    this.selectedDays = [];

    this.disabledTimes = [];
    this.availableTimes = [];
    this.availableDatesMap = new Map<string, MovieDate[]>();
    this.selectedTimes = [];

    this.displayTimes = [];
    this.form = this.formBuilder.group({
      days: this.formBuilder.array([]),
      times: this.formBuilder.array([]),
    });
    this.addNewDate();
  }

  ngOnInit(): void {
  }

  showLess(): void {
    this.currentPage -= 1;
    for (let i = 1; i <= 20; i++) {
      this.movies.pop();
    }
  }

  showMore(): void {
    this.movieService
      .getAllMovies(this.currentPage + 1)
      .subscribe((movies: Movie[]) => {
        this.currentPage += 1;
        this.movies.push(...movies);
      });
  }

  clickMovie(index: number): void {
    this.selectedMovie = index;
    const movieID = this.movies[this.selectedMovie].id;
    this.movieService
      .getMovie(movieID)
      .subscribe((movie: Movie) => {
        this.movie = movie;
        this.availableTimes = this.cinemaService.getAvailableDates(movie.runtime, this.room);
        this.createAvailableDatesMap();
      });

  }

  private createAvailableDatesMap(): void {
    const newMap = new Map<string, MovieDate[]>();
    newMap.set('', null);
    this.availableTimes.forEach(availableTime => {
      const key = availableTime.getDay();
      if (newMap.has(key)) {
        newMap.get(key).push(availableTime);
      } else {
        newMap.set(key, [availableTime]);
      }
    });
    this.availableDatesMap = newMap;
  }

  private updateDisabledTimes(): void {
    this.disabledTimes = [];
    this.availableTimes.forEach(availableTime => {
      const overlaps = this.convertSelectedTimes().find(selectedTime =>
        selectedTime && selectedTime.overlaps(availableTime)
      );
      if (overlaps) {
        this.disabledTimes.push(availableTime);
      }
    });
  }

  selectedTimeForDay(selectedDateIndex: number): void {
    this.updateDisabledTimes();
    const day = this.selectedDays[selectedDateIndex];
    this.displayTimes[selectedDateIndex] = this.availableDatesMap.get(day);
  }

  getDisplayDays(): string[] {
    return [...this.availableDatesMap.keys()].slice(1);
  }

  getDaysControls(): FormArray {
    return this.form.controls.days as FormArray;
  }

  getTimesControls(): FormArray {
    return this.form.controls.times as FormArray;
  }

  addNewDate(): void {
    this.selectedDays.push('');
    this.selectedTimes.push('');
    this.displayTimes.push([]);
    this.getDaysControls().push(new FormControl('', Validators.required));
    this.getTimesControls().push(new FormControl('', Validators.required));
  }

  deleteDate(index: number): void {
    this.selectedDays.splice(index, 1);
    this.selectedTimes.splice(index, 1);
    this.displayTimes.splice(index, 1);
    this.getDaysControls().removeAt(index);
    this.getTimesControls().removeAt(index);
    this.updateDisabledTimes();
  }

  convertToMovieDate(movieDateStr: string): MovieDate {
    return new MovieDate().fromJSONString(movieDateStr);
  }

  private convertSelectedTimes(): MovieDate[] {
    return this.selectedTimes.map(selectedTime => selectedTime === '' ? null :
      new MovieDate(null, null, this.room.roomID).fromJSONString(selectedTime)
    );
  }

  saveMovie(): void {
    const releaseDate = new Timestamp(this.movie.releaseDate.getTime() / 1000, 0);
    const moviePlaying = new MoviePlaying(this.movie.id, this.movie.title, this.movie.runtime, releaseDate,
      this.movie.posterPath, this.movie.genres, this.movie.voteAverage);

    const dates = this.convertSelectedTimes();
    const originalDates = this.convertSelectedTimes();

    for (let i = 2; i <= this.selectedWeeks; i++) {
      const newDates = originalDates.map(date => {
        const startTime = new Timestamp(date.startTime.seconds + 604800 * (i - 1), date.startTime.nanoseconds);
        const endTime = new Timestamp(date.endTime.seconds + 604800 * (i - 1), date.endTime.nanoseconds);
        return new MovieDate(startTime, endTime, date.roomID);
      });
      dates.push(...newDates);
    }
    this.cinemaService.addMoviePlaying(this.room, moviePlaying, dates);
  }
}
