import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../shared/models/error.model';
import { CinemaService } from '../../../shared/services/cinema.service';

@Component({
  selector: 'cmb-cinema-create-edit-base',
  template: ''
})
export abstract class CinemaCreateEditBaseComponent implements OnInit {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  showConfig = false;
  cinemaConfig: string[][];
  title = 'Default title';

  protected constructor(
    public cinemaService: CinemaService,
    public formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      nameFC: [
        null, [
          Validators.required,
          Validators.maxLength(30)
        ]
      ],
      rowFC: [
        null, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.max(100),
          Validators.min(1)
        ]
      ],
      colFC: [
        null, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.max(100),
          Validators.min(1)
        ]
      ]
    });
  }

  ngOnInit(): void {
  }

  createCinemaConfig(): void {
    this.cinemaConfig = [];
    for (let i = 0; i < this.form.controls.rowFC.value; i++) {
      this.cinemaConfig.push([]);
      for (let j = 0; j < this.form.controls.colFC.value; j++) {
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
