import { Component, Inject, inject, signal, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { UnitOfMeasureService } from '../../core/services/unit-of-measure.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { TypedFormGroup } from '@shared/types/types-form';
import { UnitOfMeasureForm } from '../../core/types';
import { FormBuilder } from '@angular/forms';
import { buildUnitOfMeasureForm } from '../../helpers';

@Component({
  selector: 'app-unit-of-measure-new-edit-modal',
  imports: [],
  template: ` <p>unit-of-measure-new-edit-modal works!</p> `,
  styles: ``,
})
export class UnitOfMeasureNewEditModalComponent extends BaseComponent {
  visible = signal<boolean>(false);
  title = signal<string>('Crear Unidad de Medida');
  callback: any;
  form!: TypedFormGroup<UnitOfMeasureForm>;
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  #unitOfMeasureService = inject(UnitOfMeasureService);
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.UNIT_OF_MEASURE, viewContainerRef);
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildUnitOfMeasureForm());
  }

  openModal(id?: number, callback?: () => void) {
    this.createForm();
    this.visible.set(true);
    if (id) {
      this.title.set('Editar Unidad de Medida');
      this.form.patchValue({
        und_id: id,
      });
      this.loadData(id);
    }
    this.callback = callback;
  }

  loadData(id: number) {
    this.#unitOfMeasureService.getById(id).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (response) => {
        this.#globalNotification.openToastAlert('Error', response, 'danger');
      },
    });
  }
}
