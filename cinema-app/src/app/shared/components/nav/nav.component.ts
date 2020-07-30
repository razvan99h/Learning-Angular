import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'cmb-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  isHandset = false;
  backButton = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private location: Location
  ) {
    this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.backButton = event.url.includes('cinema/');
        }
      });
  }

  goToMain(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.location.back();
  }

}
