import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCinemaComponent } from '../create-cinema/create-cinema.component';
import { CinemaService } from '../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
    public cinemaService: CinemaService,
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

  openConfirmationDialog(roomID: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      data: {
        message: `remove the cinema room "${name}"`,
        fctRef: this.removeCinemaRoom,
        args: [roomID]
      }
    });
  }

  removeCinemaRoom(roomID: string): void {
    this.cinemaService.removeRoom(roomID);
  }
}
