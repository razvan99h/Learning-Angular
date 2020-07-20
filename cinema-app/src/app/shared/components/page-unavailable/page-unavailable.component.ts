import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'cmb-page-unavailable',
  templateUrl: './page-unavailable.component.html',
  styleUrls: ['./page-unavailable.component.scss']
})
export class PageUnavailableComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }
}
