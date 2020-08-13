import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { CinemaService } from '../../../shared/services/cinema.service';
import { MatDialog } from '@angular/material/dialog';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { CinemaEditComponent } from '../cinema-create-edit/cinema-edit/cinema-edit.component';
import { ConfirmationMessage } from '../../../shared/models/confirmation.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'cmb-cinema-list-details-base',
  template: '',
})

export abstract class CinemaListDetailsBaseComponent implements OnInit, OnDestroy {
  isHandset = false;
  isHandsetSubscription: Subscription;

  protected constructor(
    public sharedService: SharedService,
    public cinemaService: CinemaService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
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
      panelClass: 'custom-confirmation-modal',
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
