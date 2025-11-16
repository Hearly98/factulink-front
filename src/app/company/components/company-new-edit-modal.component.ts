import { Component, Inject, inject, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { TypedFormGroup } from '../../shared/types/types-form';
import { CompanyForm } from '../core/types';
import { buildCompanyForm, companyStructure } from '../helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MODULES } from '../../core/config/permissions/modules';
import {
  CardComponent,
  CardBodyComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
  ColComponent,
  ButtonDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CompanyService } from '../core/services/company.service';

@Component({
  selector: 'app-company-new-edit-modal',
  standalone: true,
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
  template: `
    <c-modal alignment="center" [visible]="visible" backdrop="static" size="lg">
      <c-modal-body class="modal-body">
        <c-row class="mb-2">
          <c-col [sm]="6" class="space-between">
            <h5>{{ title }}</h5>
          </c-col>
          <c-col class="text-end">
            <button cButton color="secondary" class="me-2" (click)="onClose()">
              <svg cIcon name="cilX"></svg>
              Cancelar
            </button>
            <button cButton color="success">
              <svg cIcon name="cilSave"></svg>
              Guardar
            </button>
          </c-col>
        </c-row>
        <c-card>
          <c-card-body [formGroup]="form">
            <c-row>
              @for(item of structure; track $index){
              <c-col [md]="item.col">
                <label for="" class="form-label">{{ item.label }}</label>
                @switch (item.type) { @case ('select') {
                <select
                  class="form-control form-select"
                  name=""
                  id=""
                  [formControlName]="item.formControlName"
                >
                  <option value="null">Seleccione</option>
                </select>
                }@default {
                <input
                  class="form-control"
                  type="text"
                  name=""
                  id=""
                  [formControlName]="item.formControlName"
                />
                } }
              </c-col>
              }
            </c-row>
          </c-card-body>
        </c-card>
      </c-modal-body>
    </c-modal>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CompanyNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<CompanyForm>;
  visible = false;
  structure = companyStructure;
  #companyService = inject(CompanyService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Compañia';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.COMPANY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildCompanyForm());
  }

  openModal(idCompany?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    if (idCompany) {
      this.loadData(idCompany);
    }
  }

  loadData(idCompany: number) {
    this.#companyService.getById(idCompany).subscribe({
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
