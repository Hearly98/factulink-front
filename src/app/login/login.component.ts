import { Component, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { buildLoginForm, loginStructure } from './helpers';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class LoginComponent {
  public loginStructure = loginStructure();
  public form!: FormGroup;
  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.createForm();
  }

  private createForm() {
    this.loginStructure.forms.forEach(form => {
      this.form = this.#formBuilder.group(buildLoginForm());
    });
  }
}
