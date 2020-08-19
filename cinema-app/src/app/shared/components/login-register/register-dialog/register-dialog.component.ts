import { Component } from '@angular/core';
import { LoginRegisterComponent } from '../login-register.component';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cmb-register-dialog',
  templateUrl: './../login-register.component.html',
  styleUrls: ['./../login-register.component.scss']
})
export class RegisterDialogComponent extends LoginRegisterComponent {

  constructor(
    protected formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    super(formBuilder);
    this.title = `Create a new account`;
    this.actionButtonIcon = 'person_add';
    this.actionButtonText = 'Register';
  }


  openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  tryRegister(user: User): void {
    this.authService.doRegister(user)
      .then(() => {
        this.snackBar.open('Account created successfully! You can login now.', 'OK', {
          duration: 5000,
        });
      }, () => {
        this.snackBar.open('Account creation failed!', 'Try again', {
          duration: 5000,
        }).onAction()
          .subscribe(() => {
            this.openRegisterDialog();
          });
      });
  }

  doAction(): void {
    this.tryRegister(this.form.value);
  }
}
