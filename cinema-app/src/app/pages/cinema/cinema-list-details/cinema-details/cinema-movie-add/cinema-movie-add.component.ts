import { Component, Inject, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../../shared/models/cinema.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaService } from '../../../../../shared/services/cinema.service';
import { Movie, MovieDate, MoviePlaying } from '../../../../../shared/models/movie.model';
import { MovieService } from '../../../../../shared/services/movie.service';
import * as firebase from 'firebase';
import { FormControl, Validators } from '@angular/forms';
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
  selectedDays: string[];
  availableTimes: MovieDate[];
  displayTimes: MovieDate[][];
  selectedTimes: string[];
  daysControl: FormControl[];
  timesControl: FormControl[];

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
    this.selectedDays = [];
    this.selectedTimes = [];
    this.displayTimes = [];
    this.daysControl = [];
    this.timesControl = [];
    this.addNewDate();

    // TODO: fetch this from a service
    this.availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.availableTimes = [
      new MovieDate(new Timestamp(1596650400, 0), new Timestamp(1596654000, 0)),
      new MovieDate(new Timestamp(1596657600, 0), new Timestamp(1596661200, 0)),
      new MovieDate(new Timestamp(1596715200, 0), new Timestamp(1596722400, 0)),
      new MovieDate(new Timestamp(1596740400, 0), new Timestamp(1596744000, 0)),
    ];
  }

  ngOnInit(): void {

  }

  clickMovie(index: number): void {
    this.selectedMovie = index;
  }

  updateDisplayTimes(updatedDateIndex = -1): void {
    if (updatedDateIndex !== -1) {
      this.selectedTimes[updatedDateIndex] = '';
    }
    this.selectedDays.forEach((day, dateIndex) => {
      this.addDisplayTimes(day, dateIndex);
      this.filterDisplayTimesForDate(dateIndex);
    });
  }

  private addDisplayTimes(day: string, dateIndex: number): void {
    this.displayTimes[dateIndex] = [];
    this.availableTimes.forEach(time => {
      if (time.getDay() === day) {
        this.displayTimes[dateIndex].push(time);
      }
    });
  }

  private filterDisplayTimesForDate(dateIndex: number): void {
    // displayTimes for a dateIndex which are not found in the selected times
    this.displayTimes[dateIndex] = this.displayTimes[dateIndex]
      .filter(displayTime => {
        for (let i = 0; i < this.selectedTimes.length; i++) {
          if (i !== dateIndex) {
            if (displayTime.toJSONString() === this.selectedTimes[i]) {
              return false;
            }
          }
        }
        return true;
      });
  }

  private filterDisplayTimesAll(selectedDateIndex: number): void {
    const selectedTime = this.selectedTimes[selectedDateIndex];
    for (let i = 0; i < this.selectedDays.length; i++) {
      if (i !== selectedDateIndex) {
        this.displayTimes[i] = this.displayTimes[i].filter(displayTime => displayTime.toJSONString() !== selectedTime);
      }
    }
  }


  selectedTimeForDay(selectedDateIndex: number): void {
    this.filterDisplayTimesAll(selectedDateIndex);
    // console.log(this.selectedTimes);
  }

  addNewDate(): void {
    this.selectedDays.push('');
    this.selectedTimes.push('');
    this.displayTimes.push([]);
    this.daysControl.push(new FormControl('', Validators.required));
    this.timesControl.push(new FormControl('', Validators.required));
  }

  deleteDate(index: number): void {
    this.selectedDays.splice(index, 1);
    this.selectedTimes.splice(index, 1);
    this.displayTimes.splice(index, 1);
    this.daysControl.splice(index, 1);
    this.timesControl.splice(index, 1);
    this.updateDisplayTimes();
  }

  validForms(): boolean {
    let isValid = true;
    this.daysControl.forEach(control => {
      if (!control.valid) {
        isValid = false;
      }
    });
    this.timesControl.forEach(control => {
      if (!control.valid) {
        isValid = false;
      }
    });
    return isValid;
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

  convertToMovieDate(movieDateStr: string): MovieDate {
    return new MovieDate().fromJSONString(movieDateStr);
  }

  saveMovie(): void {
    const movieID = this.movies[this.selectedMovie].id;
    this.movieService
      .getMovie(movieID)
      .subscribe((movie: Movie) => {
        const moviePlaying = new MoviePlaying(movie.id, movie.title, movie.runtime,
          new Timestamp(movie.releaseDate.getTime() / 1000, 0), movie.posterPath, movie.genres);
        const dates = this.selectedTimes.map(selectedTime => new MovieDate().fromJSONString(selectedTime));
        this.cinemaService.updateWithMoviePlaying(this.room, moviePlaying, dates);
      });
  }
}
