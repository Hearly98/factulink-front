import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-organization-new-edit-modal',
  imports: [],
  template: ` <p>organization-new-edit-modal works!</p> `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationNewEditModalComponent {
  visible: boolean = false;
  
  
  openModal(id?: number, callback?: () => void) {
    this.visible = true;
  }
}
