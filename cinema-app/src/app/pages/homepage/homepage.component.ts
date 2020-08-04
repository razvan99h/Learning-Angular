import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from '../../shared/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SharedService } from '../../shared/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'cmb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  movies: Movie[];
  genres: Map<number, string>;
  isHandset = false;
  private isHandsetSubscription: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });
    this.movieService
      .getAllGenres()
      .subscribe((genres: Map<number, string>) => {
        this.genres = genres;

        this.movieService
          .getAllMovies(4)
          .subscribe((movies: Movie[]) => {
            this.movies = movies;
            // TODO: citesc despre merge request
          });
      });
  }

  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
  }
}
