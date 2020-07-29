import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'cmb-cinema',
  templateUrl: './cinema.component.html'
})
export class CinemaComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset();
  }

}
