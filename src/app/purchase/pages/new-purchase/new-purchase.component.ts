import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
} from '@coreui/angular';
import { purchaseStructure } from '../../helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '@shared/types/types-form';
import { PurchaseForm } from '../../core/purchase.form';
import { BaseComponent } from '@shared/base/base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { buildPurchaseForm } from '../../helpers/build-purchase-form';

@Component({
  selector: 'app-new-purchase',
  imports: [
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    ReactiveFormsModule,
  ],
  template: `
    <c-container [formGroup]="form">
      @for (item of structure(); track $index) {
      <c-card class="mb-4">
        <c-card-body>
          <c-row>
            <c-col [md]="12">
              <h5>{{ item.title }}</h5>
            </c-col>
          </c-row>
          <c-row>
            @for (control of item.controls; track $index) {
            <c-col [md]="control.col">
              <label [for]="control.formControlName">{{ control.label }}</label>
              @switch (control.type) { @case('select'){
              <select class="form-control form-select" [formControlName]="control.formControlName">
                @for (option of control.options; track $index) {
                <option [ngValue]="null">Seleccione</option>
                }
              </select>
              } @default {
              <input
                [formControlName]="control.formControlName"
                [type]="control.type"
                class="form-control"
              />
              } }
            </c-col>
            }
          </c-row>
        </c-card-body>
      </c-card>
      }
    </c-container>
  `,
  styles: ``,
})
export class NewPurchaseComponent extends BaseComponent implements OnInit {
  structure = signal(purchaseStructure());
  form!: TypedFormGroup<PurchaseForm>;
  #formBuilder = inject(FormBuilder);
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildPurchaseForm());
  }
}
