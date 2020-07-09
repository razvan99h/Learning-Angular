import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
  subscriptionMovieDetails: Subscription;

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
    this.movieService
      .getMovie(movieID)
      .subscribe(movie => {
        this.movieStatus = 'available';
        this.movie = movie;
        this.movieService
          .getVideoYoutube(this.movie.id)
          .subscribe(videoYoutube => {
            this.movie.videoYoutube = videoYoutube;
          });
        this.movieService
          .getImages(this.movie.id)
          .subscribe(images => {
            this.movie.images = images;
          });
        this.movieService
          .getPersons(this.movie.id)
          .subscribe(persons => {
            this.movie.cast = persons.cast;
            this.movie.crew = persons.crew;
          });

      }, () => {
        this.movieStatus = 'unavailable';
      });

    // this.subscriptionMovieDetails = this.sharedService.getClickEventMovieDetails().subscribe(id => {
    //   console.log('movieID: ', id);
    // });

  }


  ngOnDestroy(): void {
    // this.subscriptionMovieDetails.unsubscribe();
    // TODO: ar trebui sa dau unsubscribe la observable-urile din movieService? cu ce metoda?
  }
}
