import { Component } from '@angular/core';
import { LoginRegisterComponent } from '../login-register.component';

@Component({
  selector: 'cmb-login-dialog',
  templateUrl: './../login-register.component.html',
  styleUrls: ['./../login-register.component.scss']
})
export class LoginDialogComponent extends LoginRegisterComponent{

  constructor(
  ) {
    super();
    this.title = `Login to your account`;
    this.actionButtonIcon = 'login';
    this.actionButtonText = 'Login';
  }

  doAction(): void {
    // TODO: do it with Firebase
    localStorage.setItem('email', this.emailFC.value);
    localStorage.setItem('password', this.passwordFC.value);
  }
}
