import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CinemaCreateComponent } from '../cinema-create-edit/cinema-create/cinema-create.component';
import { CinemaService } from '../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CinemaEditComponent } from '../cinema-create-edit/cinema-edit/cinema-edit.component';
import { ActivatedRoute } from '@angular/router';
import { skip } from 'rxjs/operators';
import { ConfirmationMessage } from '../../../shared/models/confirmation.model';

@Component({
  selector: 'cmb-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['./cinema-list.component.scss', '../cinema.component.scss']
})
export class CinemaListComponent implements OnInit, OnDestroy {
  rooms: CinemaRoom[];
  isHandset = false;
  private isHandsetSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private cinemaService: CinemaService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });
    // fetch data through CinemaListResolver
    this.route.data
      .subscribe((data: { rooms: CinemaRoom[] }) => {
        this.rooms = data.rooms;
      });
    this.cinemaService
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

  openEditDialog(room: CinemaRoom): void {
    this.dialog.open(CinemaEditComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      data: room,
      autoFocus: false
    });
  }

  openConfirmationDialog(roomID: string, name: string): void {
    const confirmation: ConfirmationMessage = new ConfirmationMessage();
    confirmation.icon = 'error_outline';
    confirmation.title = 'Warning';
    confirmation.message = `Are you sure you want to remove the cinema room "${name}"?`;
    confirmation.yesButton = 'Yes';
    confirmation.noButton = 'No';
    confirmation.fctRef = this.removeCinemaRoom;
    confirmation.args = [roomID];

    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      data: confirmation
    });
  }

  removeCinemaRoom(roomID: string): void {
    this.cinemaService.removeRoom(roomID);
  }

  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
  }
}
