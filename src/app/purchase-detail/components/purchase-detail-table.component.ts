import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TableDirective,
  TableColorDirective,
  TableActiveDirective,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  RowComponent,
  ColComponent,
} from '@coreui/angular';
import { TypedFormGroup } from '@shared/types/types-form';
import { SelectOption } from '@shared/types';
import { PurchaseDetailForm } from '../core/types';

@Component({
  selector: 'app-purchase-detail-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
  ],
  template: `
    <c-card class="mb-4">
      <c-card-body>
        <c-row>
          <c-col>
            <h5>Detalle de Productos</h5>
          </c-col>
        </c-row>
        <table cTable [striped]="true" [hover]="true" class="table-responsive">
          <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th style="width: 25%">Producto</th>
              <th style="width: 15%">Categoría</th>
              <th style="width: 10%">Stock</th>
              <th style="width: 12%">Unid. Medida</th>
              <th style="width: 10%">Cantidad</th>
              <th style="width: 12%">Precio</th>
              <th style="width: 11%">Total</th>
              <th style="width: 11%">Descuento</th>
              <th style="width: 5%">Acción</th>
            </tr>
          </thead>
          <tbody>
            @if (detailsArray.length === 0) {
            <tr>
              <td colspan="10" class="text-center text-muted py-4">No hay productos agregados</td>
            </tr>
            } @for (detail of detailsArray.controls; track $index) {
            <tr [formGroup]="detail">
              <td>{{ $index + 1 }}</td>
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  formControlName="prod_nom"
                />
              </td>
              <td>
                <select class="form-control form-control-sm form-select" formControlName="cat_id">
                  <option [ngValue]="null">Seleccione</option>
                  @for (category of categories; track category.value) {
                  <option [ngValue]="category.value">{{ category.label }}</option>
                  }
                </select>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <span
                    class="badge"
                    [class.bg-success]="detail.value.stock && detail.value.stock > 10"
                    [class.bg-warning]="
                      detail.value.stock && detail.value.stock > 0 && detail.value.stock <= 10
                    "
                    [class.bg-danger]="!detail.value.stock || detail.value.stock === 0"
                  >
                    Stock: {{ detail.value.stock || 0 }}
                  </span>
                </div>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  formControlName="unid_med"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="cantidad"
                  (input)="calculateSubtotal($index)"
                  min="1"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="precio"
                  (input)="calculateSubtotal($index)"
                  min="0"
                  step="0.01"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="subtotal"
                />
              </td>
              <td>
                <button
                  type="button"
                  cButton
                  color="danger"
                  size="sm"
                  variant="ghost"
                  (click)="removeDetail($index)"
                  title="Eliminar"
                >
                  <svg cIcon name="cilTrash" size="sm"></svg>
                </button>
              </td>
            </tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="text-end"><strong>Total:</strong></td>
              <td colspan="2">
                <strong>{{ calculateTotal() | number : '1.2-2' }}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </c-card-body>
    </c-card>
  `,
  styles: [
    `
      .badge {
        font-size: 0.85rem;
        padding: 0.35em 0.65em;
      }
    `,
  ],
})
export class PurchaseDetailTableComponent {
  @Input() detailsArray!: FormArray<TypedFormGroup<PurchaseDetailForm>>;
  @Input() categories: SelectOption[] = [];
  @Output() detailRemoved = new EventEmitter<number>();

  #formBuilder = inject(FormBuilder);

  calculateSubtotal(index: number) {
    const detail = this.detailsArray.at(index);
    const cantidad = detail.value.cantidad || 0;
    const precio = detail.value.precio || 0;
    const subtotal = cantidad * precio;
    detail.patchValue({ subtotal });
  }

  calculateTotal(): number {
    return this.detailsArray.controls.reduce((total, control) => {
      return total + (control.value.subtotal || 0);
    }, 0);
  }

  removeDetail(index: number) {
    this.detailsArray.removeAt(index);
    this.detailRemoved.emit(index);
  }
}
