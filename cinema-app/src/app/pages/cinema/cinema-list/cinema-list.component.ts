import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCinemaComponent } from '../create-cinema/create-cinema.component';
import { CinemaService } from '../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../shared/models/cinema.model';

@Component({
  selector: 'cmb-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['./cinema-list.component.scss', '../cinema.component.scss']
})
export class CinemaListComponent implements OnInit {
  isHandset$: Observable<boolean>;
  rooms: CinemaRoom[];

  constructor(
    private sharedService: SharedService,
    private cinemaService: CinemaService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
    this.cinemaService
      .getCinemaRooms()
      .subscribe(rooms => {
        this.rooms = rooms;
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCinemaComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
