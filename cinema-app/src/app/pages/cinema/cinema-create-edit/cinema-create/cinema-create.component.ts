import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { CinemaCreateEditBaseComponent } from '../cinema-create-edit-base.component';

@Component({
  selector: 'cmb-cinema-create',
  templateUrl: './../cinema-create-edit-base.component.html',
  styleUrls: ['./../cinema-create-edit-base.component.scss']
})
export class CinemaCreateComponent extends CinemaCreateEditBaseComponent implements OnInit {

  constructor(
    public cinemaService: CinemaService,
  ) {
    super(cinemaService);
    this.title = 'Create a new room';
  }

  saveConfig(): void {
    this.cinemaService.addRoom(new CinemaRoom(this.nameFC.value, this.rowFC.value, this.colFC.value));
  }
}
