import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { IconDirective } from '@coreui/icons-angular';
import { environment } from '@environments/environment';

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
    IconDirective,
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
              <th style="width: 25%">Codigo</th>
              <th style="width: 10%">Cantidad</th>
              <th style="width: 12%">Unid. Medida</th>
              <th style="width: 12%">Costo Unitario</th>
              <th style="width: 12%">Precio Unitario</th>
              <th style="width: 11%">Precio Compra</th>
              <th style="width: 11%">Dscto</th>
              @if (showActions) {
              <th style="width: 5%"></th>
              }
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
                <p class="form-control form-control-sm">{{ detail.value.prod_cod_interno }}</p>
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="cantidad"
                  min="1"
                />
              </td>
              <td>
                <p class="form-control form-control-sm">{{ detail.value.unidad }}</p>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  formControlName="costo_unitario"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="precio_unitario"
                  min="0"
                  step="0.01"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  formControlName="precio_compra"
                />
              </td>
              <td>
                <input type="number" class="form-control form-control-sm" formControlName="dscto" />
              </td>
              @if (showActions) {
              <td>
                <button
                  type="button"
                  cButton
                  color="danger"
                  size="sm"
                  (click)="removeDetail($index)"
                  title="Eliminar"
                >
                  <svg cIcon name="cilTrash" size="sm"></svg>
                </button>
              </td>
              }
            </tr>
            }
          </tbody>
        </table>
        <c-row class="align-items-end text-end flex-column">
          <c-col md="12" class="mb-2">
            <c-row>
              <c-col><strong>DSCTO. TOTAL:</strong></c-col>
              <c-col md="2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  [value]="totalDscto()"
                  readonly
                />
              </c-col>
            </c-row>
          </c-col>

          <c-col md="12" class="mb-2">
            <c-row>
              <c-col><strong>BASE I.G.V:</strong></c-col>
              <c-col md="2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  [value]="totalBase()"
                  readonly
                />
              </c-col>
            </c-row>
          </c-col>

          <c-col md="12" class="mb-2">
            <c-row>
              <c-col><strong>I.G.V. (18%):</strong></c-col>
              <c-col md="2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  [value]="totalIgv()"
                  readonly
                />
              </c-col>
            </c-row>
          </c-col>

          <c-col md="12">
            <c-row>
              <c-col><strong>TOTAL A PAGAR:</strong></c-col>
              <c-col md="2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  [value]="totalFinal()"
                  readonly
                />
              </c-col>
            </c-row>
          </c-col>
        </c-row>
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
export class PurchaseDetailTableComponent implements OnInit, OnChanges {
  @Input() detailsArray!: FormArray<TypedFormGroup<PurchaseDetailForm>>;
  @Input() showActions: boolean = true;
  @Output() detailRemoved = new EventEmitter<number>();

  readonly IGV = environment.igv ?? 0.18;

  // Totales como SIGNALS
  totalDscto = signal(0);
  totalBase = signal(0);
  totalIgv = signal(0);
  totalFinal = signal(0);

  ngOnInit() {
    this.detailsArray.valueChanges.subscribe(() => {
      this.recalculate(this.detailsArray.getRawValue());
    });

    this.recalculate(this.detailsArray.getRawValue());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detailsArray'] && this.detailsArray) {
      const values = this.detailsArray.getRawValue();
      this.recalculate(values);
    }
  }

  /** ========== RECALCULAR TOTALLY REACTIVE ========== */
  recalculate(rows: PurchaseDetailForm[]) {
    let totalDscto = 0;
    let base = 0;
    let totalCompra = 0;

    rows.forEach((r) => {
      const cant = Number(r.cantidad) || 0;
      const costo = Number(r.costo_unitario) || 0;
      const dscto = Number(r.dscto) || 0;

      const precioUnitario = costo * this.IGV;
      const precioCompra = cant * precioUnitario - dscto;

      totalDscto += dscto;
      totalCompra += precioCompra;
      base += cant * costo - dscto;

      // Patch para mantener sincronizado
      const rowGroup = this.detailsArray.controls.find((x) => x.value.prod_id === r.prod_id);
      rowGroup?.patchValue(
        {
          precio_unitario: precioUnitario,
          precio_compra: precioCompra,
        },
        { emitEvent: false }
      );
    });

    const igvCalc = totalCompra - base;

    this.totalDscto.set(totalDscto);
    this.totalBase.set(base);
    this.totalIgv.set(igvCalc);
    this.totalFinal.set(totalCompra);
  }

  removeDetail(index: number) {
    this.detailsArray.removeAt(index);
    this.detailRemoved.emit(index);
  }
}
