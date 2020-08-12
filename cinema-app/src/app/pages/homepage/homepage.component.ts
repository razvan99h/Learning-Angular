import { Component, OnDestroy, OnInit } from '@angular/core';
import { MoviePlaying } from '../../shared/models/movie.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SharedService } from '../../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CinemaService } from '../../shared/services/cinema.service';


@Component({
  selector: 'cmb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  moviesPlaying: MoviePlaying[];
  isHandset = false;
  private isHandsetSubscription: Subscription;
  private getAllMoviesPlayingSubscription: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private cinemaService: CinemaService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.moviesPlaying = [];
  }

  ngOnInit(): void {
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });
    this.getAllMoviesPlayingSubscription = this.cinemaService
      .getAllMoviesPlaying()
      .subscribe((moviePlaying: MoviePlaying[]) => {
        this.moviesPlaying = moviePlaying;
      });
  }

  goToMovieDetails(movieID: number): void {
    this.router.navigate([`movie/${movieID}`]);
    this.sharedService.sendClickEventFromHomepage();
  }

  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
    this.getAllMoviesPlayingSubscription.unsubscribe();
  }
}
