import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form">
      <div>
        <input formControlName="firstName" />
        @if (form.get('firstName')?.invalid && form.get('firstName')?.touched) {
          <div>
            Campo requerido
          </div>
        }
      </div>
    </form>
  `,
})
export class FormComponent {
  @Input() form!: FormGroup;
}
