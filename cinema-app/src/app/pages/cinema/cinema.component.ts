import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'cmb-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.scss']
})
export class CinemaComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(
    private sharedService: SharedService
    ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
  }

}
