import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CinemaService } from '../../services/cinema.service';

@Component({
  selector: 'cmb-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  message: string;
  fctRef: any;
  args: any[];

  constructor(
    private cinemaService: CinemaService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string,
      fctRef: any,
      args: any[]
    },
  ) {
    this.message = data.message;
    this.fctRef = data.fctRef;
    this.args = data.args;
  }

  ngOnInit(): void {
  }

  confirm(): void {
    this.fctRef(...this.args);
    this.dialogRef.close();
  }


}
