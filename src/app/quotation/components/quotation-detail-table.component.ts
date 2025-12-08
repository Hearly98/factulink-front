import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-quotation-detail-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    IconDirective,
    CurrencyPipe,
  ],
  template: `
    <c-card class="mb-4">
      <c-card-body>
        <c-row>
          <c-col [md]="12">
            <h5>Detalle de Productos</h5>
          </c-col>
        </c-row>
        <c-row>
          <c-col [md]="12">
            @if (detailsArray.length > 0) {
            <table cTable striped="true">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Unidad</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Descuento</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody *ngFor="let detail of detailsArray.controls; let i = index">
                <tr [formGroup]="$any(detailsArray.at(i))">
                  <td>{{ detail.value.prod_cod }}</td>
                  <td>{{ detail.value.prod_nom }}</td>
                  <td>{{ detail.value.unidad }}</td>
                  <td>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      formControlName="cantidad"
                      min="1"
                      (change)="onQuantityChange(i)"
                      style="width: 80px"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      formControlName="precio_unitario"
                      min="0"
                      step="0.01"
                      (change)="onPriceChange(i)"
                      style="width: 100px"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      formControlName="dscto"
                      min="0"
                      step="0.01"
                      (change)="onDiscountChange(i)"
                      style="width: 80px"
                    />
                  </td>
                  <td>{{ calculateTotal(i) | currency: 'S/. ' }}</td>
                  <td>
                    <button
                      type="button"
                      cButton
                      color="danger"
                      size="sm"
                      (click)="removeDetail(i)"
                    >
                      <svg cIcon name="cilTrash"></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6" class="text-end"><strong>Total:</strong></td>
                  <td colspan="2"><strong>{{ getGrandTotal() | currency: 'S/. ' }}</strong></td>
                </tr>
              </tfoot>
            </table>
            } @else {
            <div class="alert alert-info">
              No hay productos agregados. Busque y agregue productos para continuar.
            </div>
            }
          </c-col>
        </c-row>
      </c-card-body>
    </c-card>
  `,
})
export class QuotationDetailTableComponent {
  @Input() detailsArray!: FormArray;
  @Output() detailRemoved = new EventEmitter<number>();

  calculateTotal(index: number): number {
    const detail = this.detailsArray.at(index);
    const cantidad = detail.get('cantidad')?.value || 0;
    const precioUnitario = detail.get('precio_unitario')?.value || 0;
    const descuento = detail.get('dscto')?.value || 0;
    
    const subtotal = cantidad * precioUnitario;
    const total = subtotal - descuento;
    
    detail.patchValue({ precio_total: total }, { emitEvent: false });
    return total;
  }

  getGrandTotal(): number {
    return this.detailsArray.controls.reduce((sum, control) => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precioUnitario = control.get('precio_unitario')?.value || 0;
      const descuento = control.get('dscto')?.value || 0;
      return sum + (cantidad * precioUnitario - descuento);
    }, 0);
  }

  onQuantityChange(index: number): void {
    this.calculateTotal(index);
  }

  onPriceChange(index: number): void {
    this.calculateTotal(index);
  }

  onDiscountChange(index: number): void {
    this.calculateTotal(index);
  }

  removeDetail(index: number): void {
    this.detailsArray.removeAt(index);
    this.detailRemoved.emit(index);
  }
}
