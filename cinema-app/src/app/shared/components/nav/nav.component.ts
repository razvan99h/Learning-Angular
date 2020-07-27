import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'cmb-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sharedService: SharedService,
    public router: Router
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(
        map(result => {
          // console.log(result);
          return result.matches;
        }),
        shareReplay()
      );
    this.sharedService.isHandset$ = this.isHandset$;
  }

  goToMain(): void {
    this.router.navigate(['/']);
  }


}
