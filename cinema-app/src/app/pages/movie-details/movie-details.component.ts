import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Person } from '../../shared/models/person.model';

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
  fullCrew: boolean;
  fullCast: boolean;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
  ) {
    this.movie = new Movie();
    this.movieStatus = 'default';
    this.fullCrew = false;
    this.fullCast = false;
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    // TODO: samybe add similar movies?
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

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sortCrew(crew: Person[]): Person[] {
    if (crew == null) {
      return [];
    }
    return crew.sort(person => person.job === 'Director' ? -1 : 1);
  }

  getDirectors(crew: Person[]): Person[] {
    if (crew == null) {
      return [];
    }
    return this.sortCrew(crew.filter(person => person.job === 'Director'));
  }

  ngOnDestroy(): void {
    // this.subscriptionMovieDetails.unsubscribe();
    // TODO: ar trebui sa dau unsubscribe la observable-urile din movieService? cu ce metoda?
  }
}
