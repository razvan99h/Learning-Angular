import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../../shared/models/cinema.model';
import { CinemaCreateEditBaseComponent } from '../cinema-create-edit-base.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cmb-cinema-create',
  templateUrl: './../cinema-create-edit-base.component.html',
  styleUrls: ['./../cinema-create-edit-base.component.scss']
})
export class CinemaCreateComponent extends CinemaCreateEditBaseComponent implements OnInit {

  constructor(
    public cinemaService: CinemaService,
    public formBuilder: FormBuilder
  ) {
    super(cinemaService, formBuilder);
    this.title = 'Create a new room';
  }

  saveConfig(): void {
    this.cinemaService.addRoom(
      new CinemaRoom(this.form.controls.nameFC.value, this.form.controls.rowFC.value, this.form.controls.colFC.value));
  }
}
