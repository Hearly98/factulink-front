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
import { RolService } from '../../core/services/rol.service';
import { IconDirective } from '@coreui/icons-angular';
import { buildRolForm, rolStructure } from '../../helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { RolForm } from '../../core/types/rol-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { CreateRolModel, UpdateRolModel } from '../../core/models';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { GetSucursalModel } from '../../../sucursal/core/models';

@Component({
  selector: 'app-rol-new-edit-modal',
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
  templateUrl: './rol-new-edit-modal.html',
  styleUrl: './rol-new-edit-modal.scss',
})
export class RolNewEditModal extends BaseComponent implements OnInit {
  form!: TypedFormGroup<RolForm>;
  visible = false;
  structure = rolStructure;
  sucursales: GetSucursalModel[] = []
  #sucursalService = inject(SucursalService);
  #globalNotification = inject(GlobalNotification);
  #rolService = inject(RolService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Categoria';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.ROL, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildRolForm());
  }

  openModal(idRol?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback
    if (idRol) {
      this.loadData(idRol);
    }
  }

  loadData(idRol: number) {
    this.#rolService.getById(idRol).subscribe({
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
      if (this.form.value.rol_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { rol_id, ...body } = this.form.value;
    const subscription = this.#rolService.create(body as CreateRolModel).subscribe({
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
        this.#globalNotification.openAlert(error.message);
      },
    });
    this.subscriptions.push(subscription)
  }

  update() {
    const subscription = this.#rolService.update(this.form.value as UpdateRolModel).subscribe({
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
        this.#globalNotification.openAlert(error.message);
      },
    });
    this.subscriptions.push(subscription)
  }
}
