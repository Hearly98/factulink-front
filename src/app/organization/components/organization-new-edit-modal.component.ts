import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import {
  ModalComponent,
  ModalBodyComponent,
  RowComponent,
  ColComponent,
  ButtonModule,
  CardComponent,
  CardBodyComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrganizationForm } from '../core/types';
import { TypedFormGroup } from '../../shared/types/types-form';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildOrganizationForm, organizationStructure } from '../helpers';
import { BaseComponent } from '../../shared/base/base.component';
import { MODULES } from '../../core/config/permissions/modules';
import { GetCompanyModel } from '../../company/core/models/get-company.model';
import { CompanyService } from '../../company/core/services/company.service';
import { CreateOrganizationModel } from '../core/models/create-organization.model';
import { UpdateOrganizationModel } from '../core/models/update-organization.model';
import { OrganizationService } from '../core/services/organization.service';
import { GlobalNotification } from '../../shared/alerts/global-notification/global-notification';

@Component({
  selector: 'app-organization-new-edit-modal',
  imports: [
    IconDirective,
    ModalComponent,
    ModalBodyComponent,
    ButtonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    ReactiveFormsModule,
  ],
  template: `
    <c-modal [visible]="visible()">
      <c-modal-body>
        <c-row>
          <c-col>
            <h5 cModalTitle>{{ title() }}</h5>
          </c-col>
        </c-row>
        <c-card class="mt-3">
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
                  <option [ngValue]="null">Seleccione</option>
                  @for(item of companias; track $index){
                  <option [ngValue]="item.com_id">{{ item.com_nom }}</option>
                  }
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
        <c-row class="mt-3">
          <c-col md="12" class="text-end">
            <button cButton color="secondary" class="me-2" (click)="onClose()">
              <svg cIcon name="cilX"></svg>
              Cancelar
            </button>
            <button cButton color="success" (click)="onSubmit()">
              <svg cIcon name="cilSave"></svg>
              Guardar
            </button>
          </c-col>
        </c-row>
      </c-modal-body>
    </c-modal>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationNewEditModalComponent extends BaseComponent {
  visible = signal(false);
  title = signal('Crear Empresa');
  callback: any;
  form!: TypedFormGroup<OrganizationForm>;
  #formBuilder = inject(FormBuilder);
  structure = organizationStructure;
  companias: GetCompanyModel[] = [];
  #companyService = inject(CompanyService);
  #organizationService = inject(OrganizationService);
  #globalNotification = inject(GlobalNotification);
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.ORGANIZATION, viewContainerRef);
    this.createForm();
  }

  ngOnInit(): void {
    this.companiasSelectCombo();
  }

  companiasSelectCombo() {
    this.fetchData(this.#companyService.getAll(), this.companias);
  }

  openModal(id?: number, callback?: any) {
    this.createForm();
    this.visible.set(true);
    this.title.set(id ? 'Editar Empresa' : 'Nueva Empresa');
    if (id) {
      this.loadData(id);
      this.form.patchValue({ emp_id: id });
    }
    this.callback = callback;
  }

  createForm() {
    this.form = this.#formBuilder.group(buildOrganizationForm());
  }

  onClose() {
    this.visible.set(false);
  }

  loadData(idOrganization: number) {
    this.#organizationService.getById(idOrganization).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.emp_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { emp_id, ...body } = this.form.value;
    const subscription = this.#organizationService
      .create(body as CreateOrganizationModel)
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
          this.#globalNotification.openAlert(error.message);
        },
      });
    this.subscriptions.push(subscription);
  }

  update() {
    const subscription = this.#organizationService
      .update(this.form.value as UpdateOrganizationModel)
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
          this.#globalNotification.openAlert(error.message);
        },
      });
    this.subscriptions.push(subscription);
  }
}
