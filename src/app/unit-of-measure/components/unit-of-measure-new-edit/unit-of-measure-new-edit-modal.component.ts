import { Component, Inject, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { UnitOfMeasureService } from '../../core/services/unit-of-measure.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { TypedFormGroup } from '@shared/types/types-form';
import { UnitOfMeasureForm } from '../../core/types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildUnitOfMeasureForm, unitOfMeasureStructure } from '../../helpers';
import {
  ButtonModule,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CreateUnitOfMeasureModel, UpdateUnitOfMeasureModel } from '../../core/models';
import { GetSucursalModel } from 'src/app/sucursal/core/models';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';

@Component({
  selector: 'app-unit-of-measure-new-edit-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    IconDirective,
    RowComponent,
    ColComponent,
    CardComponent,
    ModalBodyComponent,
    ButtonModule,
    CardBodyComponent,
  ],
  template: ` <c-modal alignment="center" [visible]="visible()" backdrop="static">
    <c-modal-body>
      <c-row class="mb-2">
        <c-col [sm]="12">
          <h5>{{ title() }}</h5>
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
                <option [ngValue]="null">Seleccione</option>
                @for(item of sucursales; track $index){
                <option [ngValue]="item.suc_id">{{ item.suc_nom }}</option>
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
export class UnitOfMeasureNewEditModalComponent extends BaseComponent implements OnInit {
  visible = signal<boolean>(false);
  title = signal<string>('Crear Unidad de Medida');
  callback: any;
  structure = unitOfMeasureStructure;
  form!: TypedFormGroup<UnitOfMeasureForm>;
  sucursales: GetSucursalModel[] = [];
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  #unitOfMeasureService = inject(UnitOfMeasureService);
  #sucursalService = inject(SucursalService);
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.UNIT_OF_MEASURE, viewContainerRef);
    this.createForm();
  }

  ngOnInit(): void {
    this.sucursalSelectCombo();
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

  sucursalSelectCombo() {
    this.fetchData(this.#sucursalService.getAll(), this.sucursales);
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

  onClose() {
    this.visible.set(false);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.und_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { und_id, ...body } = this.form.value;
    const subscription = this.#unitOfMeasureService
      .create(body as CreateUnitOfMeasureModel)
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
    const subscription = this.#unitOfMeasureService
      .update(this.form.value as UpdateUnitOfMeasureModel)
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
