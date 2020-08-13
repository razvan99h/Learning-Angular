import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CinemaService } from '../../services/cinema.service';
import { ConfirmationMessage } from '../../models/confirmation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cmb-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  confirmation: ConfirmationMessage;
  fctRef: any;

  constructor(
    private cinemaService: CinemaService, // needed for confirm() method
    private router: Router, // needed for confirm() method
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationMessage
  ) {
    this.confirmation = data;
    this.fctRef = data.fctRef;
  }

  ngOnInit(): void {
  }

  confirm(): void {
    if (this.fctRef) {
      this.fctRef(...this.confirmation.args);
    }
    this.dialogRef.close();
  }


}
