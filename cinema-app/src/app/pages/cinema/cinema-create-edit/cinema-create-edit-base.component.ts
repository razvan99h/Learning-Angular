import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../shared/models/error.model';
import { SharedService } from '../../../shared/services/shared.service';
import { CinemaService } from '../../../shared/services/cinema.service';

@Component({
  selector: 'cmb-cinema-create-edit-base',
  template: ''
})
export abstract class CinemaCreateEditBaseComponent implements OnInit {
  isHandset$: Observable<boolean>;
  nameFC: FormControl;
  rowFC: FormControl;
  colFC: FormControl;
  matcher: MyErrorStateMatcher;
  showConfig: boolean;
  cinemaConfig: string[][];
  title: string;

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
    this.matcher = new MyErrorStateMatcher();
    this.showConfig = false;
    this.title = 'Default title for CinemaCreateEditBaseComponent component';
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

  abstract saveConfig(): void;
}
