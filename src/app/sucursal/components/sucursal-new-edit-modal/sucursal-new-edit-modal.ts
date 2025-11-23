import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { SucursalForm } from '../../core/types';
import { SucursalService } from '../../core/services/sucursal.service';
import { buildSucursalForm, SucursalStructure } from '../../helpers';
import { CreateSucursalModel, UpdateSucursalModel } from '../../core/models';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';

@Component({
  selector: 'app-sucursal-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalBodyComponent,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './sucursal-new-edit-modal.html',
  styleUrl: './sucursal-new-edit-modal.scss',
})
export class SucursalNewEditModal extends BaseComponent implements OnInit {
  form!: TypedFormGroup<SucursalForm>;
  visible = false;
  structure = SucursalStructure;
  #sucursalService = inject(SucursalService);
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Sucursal';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SUCURSAL, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildSucursalForm());
  }

  openModal(idSucursal?: number, callback: any = null) {
    this.createForm();
    this.callback = callback;
    this.visible = true;
    if (idSucursal) {
      this.loadData(idSucursal);
    }
  }

  loadData(idSucursal: number) {
    this.#sucursalService.getById(idSucursal).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  onClose() {
    this.visible = false;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.suc_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { suc_id, ...body } = this.form.value;
    const subscription = this.#sucursalService.create(body as CreateSucursalModel).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.callback(response.data);
          this.onClose();
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.message, 'danger');
      },
    });
    this.subscriptions.push(subscription);
  }

  update() {
    const subscription = this.#sucursalService
      .update(this.form.value as UpdateSucursalModel)
      .subscribe({
        next: (response) => {
          if (response.isValid) {
            this.#globalNotification.openAlert(response);
            this.callback(response.data);
            this.onClose();
          } else {
            this.#globalNotification.openAlert(response);
          }
        },
        error: (error) => {
          this.#globalNotification.openToastAlert('Error', error.message, 'danger');
        },
      });
    this.subscriptions.push(subscription);
  }
}
