import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../models/error.model';

@Component({
  selector: 'cmb-login-register',
  template: '',
})
export abstract class LoginRegisterComponent {
  emailFC: FormControl;
  passwordFC: FormControl;
  matcher = new MyErrorStateMatcher();
  title = 'Default title';
  actionButtonIcon = 'default';
  actionButtonText = 'default';

  protected constructor(
  ) {
    this.emailFC = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordFC = new FormControl('', [
      Validators.required,
      // Validators.pattern('^[0-9]*$'),
      Validators.minLength(8)
    ]);
  }

  abstract doAction(): void;

}
