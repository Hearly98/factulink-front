import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ModalComponent,
  ModalBodyComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalFooterComponent,
  ButtonDirective,
  ButtonCloseDirective,
  SpinnerComponent,
  CardComponent,
  CardBodyComponent,
  BadgeModule,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { QuotationService } from 'src/app/quotation/core/services/quotation.service';
import { ShippingGuideService } from 'src/app/shipping-guide/core/services/shipping-guide.service';
import { QuotationModel } from 'src/app/quotation/core/models/quotation.model';
import { ShippingGuideModel } from 'src/app/shipping-guide/core/models/shipping-guide.model';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

export type SearchDocumentType = 'cotizacion' | 'guia';

@Component({
  selector: 'app-search-document-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalFooterComponent,
    ButtonDirective,
    ButtonCloseDirective,
    SpinnerComponent,
    BadgeModule,
    IconDirective,
    DatePipe,
  ],
  template: `
    <c-modal alignment="center" [visible]="visible()" size="lg" (visibleChange)="onVisibleChange($event)">
      <c-modal-header>
        <h5 cModalTitle>
          @if (type() === 'cotizacion') {
            <svg cIcon name="cilFile" class="me-2 text-primary"></svg>
            Buscar Cotización
          } @else {
            <svg cIcon name="cilTruck" class="me-2 text-primary"></svg>
            Buscar Guía de Remisión
          }
        </h5>
        <button cButtonClose (click)="close()"></button>
      </c-modal-header>

      <c-modal-body>
        <!-- Search input -->
        <div class="input-group mb-3">
          <span class="input-group-text">
            <svg cIcon name="cilSearch"></svg>
          </span>
          <input
            type="text"
            class="form-control"
            [(ngModel)]="searchTerm"
            (input)="onSearchInput()"
            placeholder="{{ type() === 'cotizacion' ? 'Buscar por número o cliente...' : 'Buscar por número o destinatario...' }}"
          />
          @if (searchTerm) {
            <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
              <svg cIcon name="cilX"></svg>
            </button>
          }
        </div>

        <!-- Loading -->
        @if (loading()) {
          <div class="text-center py-5">
            <c-spinner variant="grow" size="sm"></c-spinner>
            <span class="ms-2 text-muted">Cargando...</span>
          </div>
        } @else {
          <!-- Results -->
          <div class="document-list" style="max-height: 420px; overflow-y: auto;">
            @if (filteredItems().length === 0) {
              <div class="text-center py-5 text-muted">
                <svg cIcon name="cilSearch" class="mb-2" style="width: 40px; height: 40px; opacity: 0.3;"></svg>
                <p class="mb-0">No se encontraron documentos</p>
              </div>
            } @else {
              @if (type() === 'cotizacion') {
                @for (item of asCotizaciones(); track item.cot_id) {
                  <div
                    class="document-item border rounded p-3 mb-2 cursor-pointer"
                    (click)="selectCotizacion(item)"
                  >
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                          <span class="fw-semibold">{{ item.numero_completo }}</span>
                          @if (item.estado_cotizacion) {
                            <span
                              class="badge"
                              [class.bg-warning]="item.estado_cotizacion.color === 'warning'"
                              [class.bg-success]="item.estado_cotizacion.color === 'success'"
                              [class.bg-danger]="item.estado_cotizacion.color === 'danger'"
                            >{{ item.estado_cotizacion.nombre }}</span>
                          }
                        </div>
                        <div class="row g-2 small text-muted">
                          <div class="col-6">
                            <svg cIcon name="cilUser" class="me-1" style="width:12px;height:12px;"></svg>
                            {{ item.cliente?.cli_nom || '—' }}
                          </div>
                          <div class="col-6">
                            <svg cIcon name="cilCalendar" class="me-1" style="width:12px;height:12px;"></svg>
                            {{ item.fecha_emision | date: 'dd/MM/yyyy' }}
                          </div>
                          <div class="col-6">
                            <span class="fw-medium text-dark">S/ {{ item.cot_total | number: '1.2-2' }}</span>
                          </div>
                        </div>
                      </div>
                      <button cButton color="primary" size="sm" variant="outline" class="ms-2 flex-shrink-0">
                        Seleccionar
                      </button>
                    </div>
                  </div>
                }
              } @else {
                @for (item of asGuias(); track item.guia_id) {
                  <div
                    class="document-item border rounded p-3 mb-2 cursor-pointer"
                    (click)="selectGuia(item)"
                  >
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                          <span class="fw-semibold">{{ item.numero_completo }}</span>
                          <span class="badge" [class.bg-success]="item.est" [class.bg-danger]="!item.est">
                            {{ item.est ? 'Activo' : 'Anulado' }}
                          </span>
                        </div>
                        <div class="row g-2 small text-muted">
                          <div class="col-6">
                            <svg cIcon name="cilUser" class="me-1" style="width:12px;height:12px;"></svg>
                            {{ item.destinatario_nombre || item.cliente?.cli_nom || '—' }}
                          </div>
                          <div class="col-6">
                            <svg cIcon name="cilCalendar" class="me-1" style="width:12px;height:12px;"></svg>
                            {{ item.fecha_emision | date: 'dd/MM/yyyy' }}
                          </div>
                          <div class="col-6">
                            <svg cIcon name="cilTruck" class="me-1" style="width:12px;height:12px;"></svg>
                            {{ item.tipo_traslado || '—' }}
                          </div>
                        </div>
                      </div>
                      <button cButton color="primary" size="sm" variant="outline" class="ms-2 flex-shrink-0">
                        Seleccionar
                      </button>
                    </div>
                  </div>
                }
              }
            }
          </div>
        }
      </c-modal-body>

      <c-modal-footer>
        <button cButton color="secondary" (click)="close()">Cerrar</button>
      </c-modal-footer>
    </c-modal>
  `,
  styles: `
    :host { display: contents; }

    .document-item {
      transition: background-color 0.15s ease, border-color 0.15s ease;
      cursor: pointer;
    }
    .document-item:hover {
      background-color: var(--cui-primary-bg-subtle, #cfe2ff);
      border-color: var(--cui-primary, #0d6efd) !important;
    }
    .cursor-pointer { cursor: pointer; }
  `,
})
export class SearchDocumentModalComponent {
  visible = signal(false);
  type = signal<SearchDocumentType>('cotizacion');
  loading = signal(false);
  searchTerm = '';

  private allItems = signal<(QuotationModel | ShippingGuideModel)[]>([]);
  filteredItems = signal<(QuotationModel | ShippingGuideModel)[]>([]);

  private callback: ((item: QuotationModel | ShippingGuideModel) => void) | null = null;

  readonly #quotationService = inject(QuotationService);
  readonly #guiaService = inject(ShippingGuideService);

  openModal(type: SearchDocumentType, callback: (item: QuotationModel | ShippingGuideModel) => void) {
    this.type.set(type);
    this.callback = callback;
    this.searchTerm = '';
    this.allItems.set([]);
    this.filteredItems.set([]);
    this.visible.set(true);
    this.load();
  }

  private load() {
    this.loading.set(true);
    const params = {
      filter: [],
      page: { page: 1, pageSize: 100 },
      sort: [{ property: 'fecha_emision', direction: 'desc' }],
    };

    const request: Observable<ResponseDto<QueryResultsModel<any>>> = this.type() === 'cotizacion'
      ? this.#quotationService.search(params)
      : this.#guiaService.search(params);

    request.subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.isValid) {
          this.allItems.set(response.data.items);
          this.filteredItems.set(response.data.items);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchInput() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems.set(this.allItems());
      return;
    }

    if (this.type() === 'cotizacion') {
      this.filteredItems.set(
        (this.allItems() as QuotationModel[]).filter(
          (c) =>
            c.numero_completo?.toLowerCase().includes(term) ||
            c.cliente?.cli_nom?.toLowerCase().includes(term)
        )
      );
    } else {
      this.filteredItems.set(
        (this.allItems() as ShippingGuideModel[]).filter(
          (g) =>
            g.numero_completo?.toLowerCase().includes(term) ||
            g.destinatario_nombre?.toLowerCase().includes(term) ||
            g.cliente?.cli_nom?.toLowerCase().includes(term)
        )
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredItems.set(this.allItems());
  }

  selectCotizacion(item: QuotationModel) {
    this.callback?.(item);
    this.close();
  }

  selectGuia(item: ShippingGuideModel) {
    this.callback?.(item);
    this.close();
  }

  close() {
    this.visible.set(false);
  }

  onVisibleChange(isVisible: boolean) {
    if (!isVisible) this.visible.set(false);
  }

  asCotizaciones(): QuotationModel[] {
    return this.filteredItems() as QuotationModel[];
  }

  asGuias(): ShippingGuideModel[] {
    return this.filteredItems() as ShippingGuideModel[];
  }
}
