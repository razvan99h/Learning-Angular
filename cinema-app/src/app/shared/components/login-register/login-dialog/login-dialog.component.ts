import { Component } from '@angular/core';
import { LoginRegisterComponent } from '../login-register.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'cmb-login-dialog',
  templateUrl: './../login-register.component.html',
  styleUrls: ['./../login-register.component.scss']
})
export class LoginDialogComponent extends LoginRegisterComponent {

  constructor(
    protected formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    super(formBuilder);
    this.title = `Login to your account`;
    this.actionButtonIcon = 'login';
    this.actionButtonText = 'Login';
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  tryLogin(user: User): void {
    this.authService.doLogin(user)
      .then(() => {
        this.snackBar.open('Login successful!', 'OK', {
          duration: 5000,
        });
        this.sharedService.sendLoginInfo(new User(user.email, ''));
      }, () => {
        this.snackBar.open('Login failed!', 'Try again', {
          duration: 5000,
        }).onAction()
          .subscribe(() => {
            this.openLoginDialog();
          });
      });
  }

  doAction(): void {
    this.tryLogin(this.form.value);
  }
}
