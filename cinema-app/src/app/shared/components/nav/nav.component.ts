import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'cmb-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  isHandset = false;

  constructor(
    private sharedService: SharedService,
    public router: Router
  ) {
    this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });
  }

  goToMain(): void {
    this.router.navigate(['/']);
  }


}
