import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cmb-page-unavailable',
  templateUrl: './page-unavailable.component.html',
  styleUrls: ['./page-unavailable.component.scss']
})
export class PageUnavailableComponent implements OnInit, OnDestroy {
  isHandset = false;
  private isHandsetSubscription: Subscription;

  constructor(
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });
  }

  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
  }
}
