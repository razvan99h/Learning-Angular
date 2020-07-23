import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../shared/models/error.model';
import { MatDialogRef } from '@angular/material/dialog';
import { CinemaService } from '../../../shared/services/cinema.service';
import { CinemaRoom } from '../../../shared/models/cinema.model';

@Component({
  selector: 'cmb-create-cinema',
  templateUrl: './create-cinema.component.html',
  styleUrls: ['./create-cinema.component.scss']
})
export class CreateCinemaComponent implements OnInit {
  isHandset$: Observable<boolean>;
  nameFC: FormControl;
  rowFC: FormControl;
  colFC: FormControl;
  matcher: MyErrorStateMatcher;
  showConfig: boolean;
  cinemaConfig: string[][];

  constructor(
    private sharedService: SharedService,
    private cinemaService: CinemaService,
    public dialogRef: MatDialogRef<CreateCinemaComponent>,

  ) {
    this.nameFC = new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
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
    this.matcher = new MyErrorStateMatcher();
    this.showConfig = false;
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
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

  saveConfig(): void {
    this.cinemaService.addRoom(new CinemaRoom(this.nameFC.value, this.rowFC.value, this.colFC.value));
  }
}
