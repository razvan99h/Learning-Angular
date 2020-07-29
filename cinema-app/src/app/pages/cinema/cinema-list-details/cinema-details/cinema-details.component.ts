import { Component, OnDestroy, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CinemaListDetailsBaseComponent } from '../cinema-list-details-base.component';

@Component({
  selector: 'cmb-cinema-details',
  templateUrl: './cinema-details.component.html',
  styleUrls: [ '../cinema-list-details-base.component.scss', './cinema-details.component.scss']
})
export class CinemaDetailsComponent extends CinemaListDetailsBaseComponent implements OnInit, OnDestroy {
  room: CinemaRoom;

  constructor(
    public sharedService: SharedService,
    public cinemaService: CinemaService,
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
}
