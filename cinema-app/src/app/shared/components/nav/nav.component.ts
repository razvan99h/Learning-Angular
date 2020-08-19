import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-register/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../login-register/register-dialog/register-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cmb-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isHandset = false;
  backButton = false;
  loggedIn = false;
  admin = false;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

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

    this.sharedService
      .getLoginInfo()
      .pipe(take(1))
      .subscribe((user: User) => {
        this.loggedIn = true;
        this.admin = user.email === environment.ADMIN_EMAIL;
      });

    this.authService
      .getCurrentUser()
      .then(user => {
        this.admin = user.email === environment.ADMIN_EMAIL;
        this.loggedIn = true;
      }, () => {
        this.loggedIn = false;
        this.admin = false;
      });
  }

  ngOnInit(): void {
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
    this.authService
      .doLogout()
      .then(() => {
        this.router.navigate(['']);
        this.snackBar.open('Logout successful!', 'OK', {
          duration: 5000,
        });
        this.admin = false;
        this.loggedIn = false;
      }, () => {
        this.snackBar.open('Logout failed!', 'Try again', {
          duration: 5000,
        }).onAction()
          .subscribe(() => {
            this.logout();
          });
      });
  }
}
