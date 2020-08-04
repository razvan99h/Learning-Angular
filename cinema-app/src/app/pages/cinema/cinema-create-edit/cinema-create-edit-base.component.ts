import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../shared/models/error.model';
import { SharedService } from '../../../shared/services/shared.service';
import { CinemaService } from '../../../shared/services/cinema.service';

@Component({
  selector: 'cmb-cinema-create-edit-base',
  template: ''
})
export abstract class CinemaCreateEditBaseComponent implements OnInit {
  nameFC: FormControl;
  rowFC: FormControl;
  colFC: FormControl;
  matcher = new MyErrorStateMatcher();
  showConfig = false;
  cinemaConfig: string[][];
  title = 'Default title';

  protected constructor(
    public sharedService: SharedService,
    public cinemaService: CinemaService,
  ) {
    this.nameFC = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]);
    this.rowFC = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.max(100),
      Validators.min(1)
    ]);
    this.colFC = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.max(100),
      Validators.min(1)
    ]);
    // TODO: fac cu form builder asta
  }

  ngOnInit(): void {
  }

  createCinemaConfig(): void {
    this.cinemaConfig = [];
    for (let i = 0; i < this.rowFC.value; i++) {
      this.cinemaConfig.push([]);
      for (let j = 0; j < this.colFC.value; j++) {
        this.cinemaConfig[i].push('free');
      }
    }
  }

  hideConfig(): void {
    this.showConfig = false;
  }

  expandConfig(): void {
    this.showConfig = true;
    this.createCinemaConfig();
  }

  abstract saveConfig(): void;
}
