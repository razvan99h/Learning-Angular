import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../models/error.model';

@Component({
  selector: 'cmb-login-register',
  template: '',
})
export abstract class LoginRegisterComponent {
  hide = true;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  title = 'Default title';
  actionButtonIcon = 'default';
  actionButtonText = 'default';

  protected constructor(
    protected formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      email: [
        null, [
          Validators.required,
          Validators.email,
        ]
      ],
      password: [
        null, [
          Validators.required,
          // Validators.pattern('^[0-9]*$'),
          Validators.minLength(8)
        ]
      ]
    });
  }

  abstract doAction(): void;

}
