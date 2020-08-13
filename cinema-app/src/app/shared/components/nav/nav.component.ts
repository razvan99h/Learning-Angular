import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-register/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../login-register/register-dialog/register-dialog.component';

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
    private location: Location,
    public dialog: MatDialog,
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

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  logout(): void {
    // TODO: do it with Firebase
    localStorage.clear();
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    // TODO: do it with Firebase
    return localStorage.getItem('email') !== null && localStorage.getItem('password') !== null;
  }

  isAdmin(): boolean {
    // TODO: do it with Firebase
    return localStorage.getItem('email') === 'admin@cmb.com' && localStorage.getItem('password') === 'password1';
  }
}
