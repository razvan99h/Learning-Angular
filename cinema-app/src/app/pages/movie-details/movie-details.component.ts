import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'cmb-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie: Movie;
  movieStatus: string;
  isHandset$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
    private sharedService: SharedService,
  ) {
    this.movie = new Movie();
    this.movieStatus = 'default';
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    const movieID = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(movieID)
      .subscribe(
        movie => {
          this.movie = movie;
          this.movieStatus = 'available';
        },
        error => {
          this.movieStatus = 'unavailable';
        });

    // TODO: stat 2h pe asta ca nu functiona: sa iau id-ul asa, sau din link?
    // this.subscription = this.sharedService.getClickEventMovieDetails().subscribe(id => {
    //   console.log('movieID: ', id);
    // });

  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
