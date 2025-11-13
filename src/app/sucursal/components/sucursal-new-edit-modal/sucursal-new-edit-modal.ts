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
  #formBuilder = inject(FormBuilder);
  title = 'Crear Sucursal';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CATEGORY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildSucursalForm());
  }

  openModal(idSucursal?: number, callback: any = null) {
    this.createForm();
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
}
