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
import { environment } from '../../../environments/environment';

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
                }@case ('file') {
                <div class="d-flex flex-column align-items-start gap-2">
                  <label class="btn btn-outline-primary btn-sm mt-1">
                    <svg cIcon name="cilCloudUpload" class="me-1"></svg>
                    {{ selectedFile ? 'Cambiar Logo' : 'Seleccionar Logo' }}
                    <input
                      type="file"
                      class="d-none"
                      (change)="onFileChange($event)"
                      accept="image/jpeg,image/png,image/jpg"
                    />
                  </label>
                  
                  @if (imagePreview()) {
                    <div class="position-relative mt-2">
                      <img [src]="imagePreview()" alt="Logo Preview" 
                           class="img-thumbnail shadow-sm" 
                           style="width: 100px; height: 100px; object-fit: contain; background: #f8f9fa;" />
                      <button (click)="removeImage()" 
                              class="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle p-1"
                              style="line-height: 1;"
                              type="button">
                        <svg cIcon name="cilX" size="sm"></svg>
                      </button>
                    </div>
                  }
                  
                  <small class="text-muted" style="font-size: 0.75rem;">
                    Límite: <strong class="text-primary">50KB</strong> (JPG, PNG)
                  </small>
                </div>
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
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
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
    this.selectedFile = null;
    this.imagePreview.set(null);
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
          if (response.data.emp_logo) {
            this.imagePreview.set(response.data.logo_url);
          }
        }
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024) {
        this.#globalNotification.openToastAlert('Archivo demasiado grande', 'El logo no debe superar los 50KB', 'danger');
        event.target.value = '';
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.#globalNotification.openToastAlert('Tipo de archivo no permitido', 'Solo se permiten imágenes JPG o PNG', 'danger');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.form.patchValue({ emp_logo: null });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValues = this.form.value as any;

    Object.keys(formValues).forEach(key => {
      if (key !== 'emp_logo' && formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('emp_logo', this.selectedFile);
    }

    return formData;
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
    const body = this.buildFormData();
    const subscription = this.#organizationService
      .create(body)
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
    const body = this.buildFormData();
    // For Laravel/PHP, PUT requests with files sometimes need _method: 'PUT' sent via POST
    // but since we updated BaseService to use putRequestForm, let's try that first.
    // However, Laravel usually expects multipart/form-data only on POST.
    // We might need to append '_method': 'PUT' to FormData and use POST.

    body.append('_method', 'PUT');

    const subscription = this.#organizationService
      .create(body) // Sending as POST with _method PUT is safer for file uploads in PHP
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
