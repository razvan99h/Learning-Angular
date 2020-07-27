import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../shared/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared/services/shared.service';


@Component({
  selector: 'cmb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  movies: Movie[];
  genres: Map<number, string>;
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
    private sharedService: SharedService,
  ) {
    this.isHandset$ = this.sharedService.isHandset$;
  }

  ngOnInit(): void {
    this.movieService
      .getAllGenres()
      .subscribe(genres => {
        this.genres = genres;

        this.movieService
          .getAllMovies(4, 22)
          .subscribe(movies => {
            this.movies = movies;
            // TODO: citesc despre merge request
          });
        // console.log(genres);
      });

  }

  // goToMovieDetails(movieID: number): void {
  //   this.sharedService.sendClickEventMovieDetails(movieID);
  // }

}
