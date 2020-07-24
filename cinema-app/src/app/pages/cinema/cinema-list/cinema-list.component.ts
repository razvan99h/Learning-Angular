import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CinemaCreateComponent } from '../cinema-create-edit/cinema-create/cinema-create.component';
import { CinemaService } from '../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CinemaEditComponent } from '../cinema-create-edit/cinema-edit/cinema-edit.component';
import { Movie } from '../../../shared/models/movie.model';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
    // fetch data through CinemaListResolver
    this.route.data
      .subscribe((data: { rooms: CinemaRoom[] }) => {
        this.rooms = data.rooms;
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CinemaCreateComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  openEditDialog(room: CinemaRoom): void {
    const dialogRef = this.dialog.open(CinemaEditComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      data: room,
      autoFocus: false
    });
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
