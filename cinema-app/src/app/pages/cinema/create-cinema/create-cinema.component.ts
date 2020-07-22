import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../shared/models/error.model';

@Component({
  selector: 'cmb-create-cinema',
  templateUrl: './create-cinema.component.html',
  styleUrls: ['./create-cinema.component.scss']
})
export class CreateCinemaComponent implements OnInit {
  isHandset$: Observable<boolean>;
  numberFormControl: FormControl;
  matcher: MyErrorStateMatcher;


  constructor(
    private sharedService: SharedService,
  ) {
    this.numberFormControl = new FormControl('', [
      Validators.required,
      Validators.max(100),
      Validators.min(1)
    ]);
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
  }

}
