import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormFeedbackComponent } from '@coreui/angular';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule, FormFeedbackComponent],
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss']
})
export class ValidationMessagesComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() messages!: any;

  getErrors(): string[] {
    let messages = this.messages[this.controlName];
    if (!messages) return [];

    if (this.form?.controls[this.controlName].pristine &&
      this.form?.controls[this.controlName].untouched
    ) return [];

    let errorMessages: string[] = [];
    let errors = this.form?.controls[this.controlName].errors;

    if (errors) {
      Object.keys(errors).slice(0, 1).forEach(errorKey => {
        if (messages[errorKey]) errorMessages.push(messages[errorKey]);
      });
    }

    return errorMessages;
  }
}
