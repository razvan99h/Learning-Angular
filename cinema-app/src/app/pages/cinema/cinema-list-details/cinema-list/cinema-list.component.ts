import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CinemaCreateComponent } from '../../cinema-create-edit/cinema-create/cinema-create.component';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { ActivatedRoute } from '@angular/router';
import { skip } from 'rxjs/operators';
import { CinemaListDetailsBaseComponent } from '../cinema-list-details-base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cmb-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['../cinema-list-details-base.component.scss', './cinema-list.component.scss']
})
export class CinemaListComponent extends CinemaListDetailsBaseComponent implements OnInit, OnDestroy {
  rooms: CinemaRoom[];
  private cinemaRoomsSubscription: Subscription;

  constructor(
    public sharedService: SharedService,
    public cinemaService: CinemaService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    super(sharedService, cinemaService, dialog);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // fetch data through CinemaListResolver
    this.route.data
      .subscribe((data: { rooms: CinemaRoom[] }) => {
        this.rooms = data.rooms;
      });
    this.cinemaRoomsSubscription = this.cinemaService
      .getCinemaRooms()
      .pipe(skip(1))
      .subscribe((rooms: CinemaRoom[]) => {
        this.rooms = rooms;
      });
  }

  openCreateDialog(): void {
    this.dialog.open(CinemaCreateComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.cinemaRoomsSubscription.unsubscribe();
  }
}
