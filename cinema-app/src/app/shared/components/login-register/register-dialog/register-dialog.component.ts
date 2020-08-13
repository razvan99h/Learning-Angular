import { Component } from '@angular/core';
import { LoginRegisterComponent } from '../login-register.component';

@Component({
  selector: 'cmb-register-dialog',
  templateUrl: './../login-register.component.html',
  styleUrls: ['./../login-register.component.scss']
})
export class RegisterDialogComponent extends LoginRegisterComponent{

  constructor(
  ) {
    super();
    this.title = `Create a new account`;
    this.actionButtonIcon = 'person_add';
    this.actionButtonText = 'Register';
  }

  doAction(): void {
    // TODO: do it with Firebase
    localStorage.setItem('email', this.emailFC.value);
    localStorage.setItem('password', this.passwordFC.value);
  }
}
