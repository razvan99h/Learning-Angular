import { Component, Inject, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../../shared/models/cinema.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaService } from '../../../../../shared/services/cinema.service';
import { Movie } from '../../../../../shared/models/movie.model';

@Component({
  selector: 'cmb-cinema-movie-add',
  templateUrl: './cinema-movie-add.component.html',
  styleUrls: ['../../cinema-list-details-base.component.scss', './cinema-movie-add.component.scss']
})
export class CinemaMovieAddComponent implements OnInit {
  room: CinemaRoom;
  movies: Movie[];
  selectedMovie = -1;

  constructor(
    private cinemaService: CinemaService,
    @Inject(MAT_DIALOG_DATA) private data: { room: CinemaRoom, movies: Movie[] }
  ) {
    this.room = data.room;
    this.movies = data.movies;
    console.log(this.movies);
  }

  ngOnInit(): void {

  }


}
