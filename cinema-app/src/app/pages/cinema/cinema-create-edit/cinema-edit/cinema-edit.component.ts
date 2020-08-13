import { Component, Inject, OnInit } from '@angular/core';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { CinemaCreateEditBaseComponent } from '../cinema-create-edit-base.component';

@Component({
  selector: 'cmb-cinema-edit',
  templateUrl: './../cinema-create-edit-base.component.html',
  styleUrls: ['./../cinema-create-edit-base.component.scss']
})
export class CinemaEditComponent extends CinemaCreateEditBaseComponent implements OnInit{
  oldRoom: CinemaRoom;

  constructor(
    public cinemaService: CinemaService,
    @Inject(MAT_DIALOG_DATA) public data: CinemaRoom,
  ) {
    super(cinemaService);
    this.nameFC.setValue(data.name);
    this.rowFC.setValue(data.rows);
    this.colFC.setValue(data.columns);
    this.oldRoom = data;
    this.title = `Edit the room "${data.name}"`;
  }

  saveConfig(): void {
    this.oldRoom.name = this.nameFC.value;
    this.oldRoom.rows = this.rowFC.value;
    this.oldRoom.columns = this.colFC.value;
    const roomID = this.oldRoom.roomID;
    this.oldRoom.roomID = null;
    this.cinemaService.editRoom(roomID, this.oldRoom);
  }

}
