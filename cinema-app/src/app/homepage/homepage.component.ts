import { Component, OnInit } from '@angular/core';
import {MovieService} from '../shared/services/movie.service';
import {Movie} from '../shared/models/movie.model';
import {GlobalVariable} from '../../globals';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  movies: Array<Movie>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
  ) { }

  ngOnInit(): void {
    this.movieService.getAllMovies()
      .subscribe(moviesDTO => {
        this.movies = moviesDTO.results;
        this.movies.forEach(movie => {
          if (movie.title.length > 25) {
            movie.title = movie.title.slice(0, 25) + '...';
          }
          movie.release_date = new Date(movie.release_date);
          movie.poster_path = GlobalVariable.IMAGE_LINK + '/w300' + movie.poster_path;
        });

        console.log(this.movies);
      });
  }

}
