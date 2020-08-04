import { Component, OnDestroy, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CinemaListDetailsBaseComponent } from '../cinema-list-details-base.component';
import { CinemaMovieAddComponent } from './cinema-movie-add/cinema-movie-add.component';
import { MovieService } from '../../../../shared/services/movie.service';
import { Movie } from '../../../../shared/models/movie.model';

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

    // TODO: remove this
    this.openMovieAddDialog();
  }

  removeCinemaRoom(roomID: string): void {
    super.removeCinemaRoom(roomID);
    this.router.navigate(['./cinema']);
  }

  openMovieAddDialog(): void {
    // TODO: folosesc fork join in loc de astea 2 subscribe-uri sau switch map in serviciu
    //  eventual arat un spinner intre timp (pana se incarca)
    this.movieService
      .getAllGenres()
      .subscribe((genresMap: Map<number, string>) => {
        this.movieService
          .getAllMovies(1)
          .subscribe((moviesList: Movie[]) => {
            this.dialog.open(CinemaMovieAddComponent, {
              panelClass: 'custom-modal',
              maxWidth: '90vw',
              autoFocus: false,
              data: {
                room: this.room,
                movies: moviesList,
                genres: genresMap
              }
            });
          });
      });
  }
}
