import { Component, Inject, OnInit } from '@angular/core';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { CinemaCreateEditBaseComponent } from '../cinema-create-edit-base.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cmb-cinema-edit',
  templateUrl: './../cinema-create-edit-base.component.html',
  styleUrls: ['./../cinema-create-edit-base.component.scss']
})
export class CinemaEditComponent extends CinemaCreateEditBaseComponent implements OnInit {
  oldRoom: CinemaRoom;

  constructor(
    public cinemaService: CinemaService,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public room: CinemaRoom,
  ) {
    super(cinemaService, formBuilder);
    this.form.controls.nameFC.setValue(room.name);
    this.form.controls.rowFC.setValue(room.rows);
    this.form.controls.colFC.setValue(room.columns);
    this.oldRoom = room;
    this.title = `Edit the room "${room.name}"`;
  }

  saveConfig(): void {
    this.oldRoom.name = this.form.controls.nameFC.value;
    this.oldRoom.rows = this.form.controls.rowFC.value;
    this.oldRoom.columns = this.form.controls.colFC.value;
    const roomID = this.oldRoom.roomID;
    this.oldRoom.roomID = null;
    this.cinemaService.editRoom(roomID, this.oldRoom);
  }

}
