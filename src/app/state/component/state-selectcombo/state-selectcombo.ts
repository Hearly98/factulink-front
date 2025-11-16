import { Component, Input, OnInit } from '@angular/core';
import { stateSelectStructure } from '../../helpers';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-state-selectcombo',
  imports: [ReactiveFormsModule],
  templateUrl: './state-selectcombo.html',
  styleUrl: './state-selectcombo.scss',
})
export class StateSelectcombo {
  @Input() form: FormGroup = new FormGroup({});
  @Input() formControlName: string = '';
  items = stateSelectStructure;

  get control() {
    return this.form.get(this.formControlName);
  }
}
