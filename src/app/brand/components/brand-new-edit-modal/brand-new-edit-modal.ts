import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { BrandService } from '../../core/services/brand.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildBrandForm, brandStructure } from '../../helpers';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { BrandForm } from '../../core/types/brand.form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { CreateMarcaModel, UpdateMarcaModel } from '../../core/models';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { StructureItem } from '../../helpers/brand-structure';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './brand-new-edit-modal.html',
  styleUrl: './brand-new-edit-modal.scss',
})
export class BrandNewEditModal extends BaseComponent implements OnInit {
  form!: TypedFormGroup<BrandForm>;
  visible = false;
  structure: StructureItem[] = brandStructure;
  readonly #globalNotification = inject(GlobalNotification);
  readonly #brandService = inject(BrandService);
  readonly #formBuilder = inject(FormBuilder);
  title = 'Crear Marca';
  callback: any;
  isEditMode = false;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.MARCA, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildBrandForm());
  }

  openModal(idBrand?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    this.isEditMode = !!idBrand;
    if (idBrand) {
      this.title = 'Editar Marca';
      this.loadData(idBrand);
    } else {
      this.title = 'Crear Marca';
    }
  }

  loadData(idBrand: number) {
    this.#brandService.getById(idBrand).subscribe({
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
      if (this.form.value.marca_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const subscription = this.#brandService.create(this.form.value as CreateMarcaModel).subscribe({
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
        this.#globalNotification.openAlert(error.error);
      },
    });
    this.subscriptions.push(subscription);
  }

  update() {
    const subscription = this.#brandService.update(this.form.value as UpdateMarcaModel).subscribe({
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
        this.#globalNotification.openAlert(error.error);
      },
    });
    this.subscriptions.push(subscription);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}
