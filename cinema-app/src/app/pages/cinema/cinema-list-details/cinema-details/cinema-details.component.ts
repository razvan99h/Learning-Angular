import { Component, OnDestroy, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CinemaListDetailsBaseComponent } from '../cinema-list-details-base.component';
import { CinemaMovieAddComponent } from './cinema-movie-add/cinema-movie-add.component';
import { MovieService } from '../../../../shared/services/movie.service';
import { ConfirmationMessage } from '../../../../shared/models/confirmation.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MovieDate } from '../../../../shared/models/movie.model';

@Component({
  selector: 'cmb-cinema-details',
  templateUrl: './cinema-details.component.html',
  styleUrls: ['../cinema-list-details-base.component.scss', './cinema-details.component.scss']
})
export class CinemaDetailsComponent extends CinemaListDetailsBaseComponent implements OnInit, OnDestroy {
  room: CinemaRoom;

  constructor(
    public sharedService: SharedService,
    public cinemaService: CinemaService,
    public movieService: MovieService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(sharedService, cinemaService, dialog);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.data
      .subscribe((data: { room: CinemaRoom }) => {
        this.room = data.room;
        this.room.roomID = this.route.snapshot.paramMap.get('id');
      });
  }

  removeCinemaRoom(roomID: string): void {
    super.removeCinemaRoom(roomID);
    this.router.navigate(['./cinema']);
  }

  openMovieAddDialog(): void {
    this.movieService
      .getMoviesAndGenres()
      .subscribe((response) => {
        const moviesList = response[0];
        const genresList = response[1];
        this.dialog.open(CinemaMovieAddComponent, {
          panelClass: 'custom-modal',
          maxWidth: '90vw',
          autoFocus: false,
          data: {
            room: this.room,
            movies: moviesList,
            genres: genresList
          }
        });
      });
  }

  removeMoviePlaying(movieID: number, cinemaRoom: CinemaRoom, ): void {
    this.cinemaService.removeMoviePlaying(movieID, cinemaRoom, );
  }

  openConfirmationDialogMovie(movieID: number, title: string): void {
    const confirmation: ConfirmationMessage = new ConfirmationMessage();
    confirmation.icon = 'error_outline';
    confirmation.title = 'Warning';
    confirmation.message = `Are you sure you want to remove "${title}" from the schedule?`;
    confirmation.yesButton = 'Yes';
    confirmation.noButton = 'No';
    confirmation.fctRef = this.removeMoviePlaying;
    confirmation.args = [movieID, this.room];

    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      data: confirmation
    });
  }

  filterActiveDates(dates: MovieDate[]): MovieDate[] {
    return dates.filter(date => date.isAfterToday());
  }
}
