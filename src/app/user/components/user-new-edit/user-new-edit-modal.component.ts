import { Component, Inject, inject, signal, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { BaseComponent } from '@shared/base/base.component';
import { TypedFormGroup } from '@shared/types/types-form';
import { GetSucursalModel } from 'src/app/sucursal/core/models';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { UserForm } from '../../core/types';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { buildUserForm, userStructure, userValidationMessage } from '../../helpers';
import { CreateUserModel, UpdateUserModel } from '../../core/models';
import { UserService } from '../../core/services/user.service';
import { GetRolModel } from 'src/app/rol/core/models';
import { RolService } from 'src/app/rol/core/services/rol.service';
import { ValidationMessagesComponent } from '@shared/components/error-messages/validation-messages.component';

@Component({
  selector: 'app-user-new-edit-modal',
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
    ValidationMessagesComponent
  ],
  template: `<c-modal alignment="center" [visible]="visible()" backdrop="static">
    <c-modal-body class="modal-body">
      <c-row class="mb-2">
        <c-col [sm]="6" class="space-between">
          <h5>{{ title() }}</h5>
        </c-col>
      </c-row>
      <c-card>
        <c-card-body [formGroup]="form">
          <c-row>
            @for(item of structure; track $index){
            <c-col [md]="item.col">
              <label for="" class="form-label">{{ item.label }}</label>
              @switch (item.type) {
                @case ('select') {
              <select
                class="form-control form-select"
                name=""
                [class.is-invalid]="
                      form.get(item.formControlName)?.invalid &&
                      form.get(item.formControlName)?.touched
                    "
                [id]="item.formControlName"
                [formControlName]="item.formControlName"
              >
                <option [ngValue]="null">Seleccione</option>
                @for(item of roles; track $index){
                <option [ngValue]="item.rol_id">{{ item.rol_nom }}</option>
                }
              </select>
                  <app-validation-messages [controlName]="item.formControlName" [form]="form" [messages]="errorMessages"></app-validation-messages>
              }@default {
              <input
                class="form-control"
                [type]="item.type"
                name=""
                [class.is-invalid]="
                      form.get(item.formControlName)?.invalid &&
                      form.get(item.formControlName)?.touched
                    "
                [id]="item.formControlName"
                [formControlName]="item.formControlName"
              />
                  <app-validation-messages [controlName]="item.formControlName" [form]="form" [messages]="errorMessages"></app-validation-messages>
              } }
            </c-col>
            }
          </c-row>
        </c-card-body>
      </c-card>
      <c-row class="mt-4">
        <c-col class="text-end">
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
  </c-modal>`,
  styles: ``,
})
export class UserNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<UserForm>;
  visible = signal<boolean>(false);
  structure = userStructure;
  roles: GetRolModel[] = [];
  errorMessages = userValidationMessage;
  #rolService = inject(RolService);
  #userService = inject(UserService);
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  title = signal<string>('Crear Usuario');
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.USERS, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.rolSelectCombo();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildUserForm());
  }

  openModal(idUser?: number, callback: any = null) {
    this.createForm();
    this.visible.set(true);
    this.callback = callback;
    if (idUser) {
      this.title.set('Editar Usuario');
      this.loadData(idUser);
    }
  }

  loadData(idUser: number) {
    this.#userService.getById(idUser).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  rolSelectCombo() {
    this.fetchData(this.#rolService.getAll(), this.roles);
  }

  onClose() {
    this.visible.set(false);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.usu_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { usu_id, ...body } = this.form.value;
    const subscription = this.#userService.create(body as CreateUserModel).subscribe({
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
    const subscription = this.#userService.update(this.form.value as UpdateUserModel).subscribe({
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
