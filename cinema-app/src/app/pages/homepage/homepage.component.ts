import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../shared/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { environment } from '../../../environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { SharedService } from '../../shared/services/shared.service';


@Component({
  selector: 'cmb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  @ViewChild(MovieDetailsComponent)
  private movieDetailsComponent: MovieDetailsComponent;

  movies: Array<Movie>;
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
    private sharedService: SharedService,
  ) {

    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.movieService
      .getAllMovies()
      .subscribe(moviesDTO => {
        this.movies = moviesDTO.results;
        // TODO: citesc despre foreach, map, reduce, filter
        // TODO: citesc despre merge request
        this.movies.map(movie => {
          if (movie.title.length > 25) {
            movie.title = movie.title.slice(0, 25) + '...';
          }
          movie.release_date = new Date(movie.release_date);
          movie.poster_path = environment.IMAGE_LINK + '/w300' + movie.poster_path;
        });

        console.log(this.movies);
      });
  }

  goToMovieDetails(movieID: number): void {
    console.log('hopa');
    this.sharedService.sendClickEventMovieDetails(movieID);
  }

}
