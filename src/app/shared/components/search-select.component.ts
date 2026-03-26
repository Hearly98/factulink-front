import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  signal,
  viewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DropdownModule,
  SpinnerComponent
} from '@coreui/angular';

import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, SpinnerComponent],
  template: `
    <div class="position-relative" #container>
      <!-- INPUT -->
      <input
        type="text"
        class="form-control"
        [class.is-invalid]="showError"
        [placeholder]="placeholder"
        [formControl]="searchCtrl"
        (focus)="onInputFocus()"
      />

      <!-- ERROR MESSAGE -->
      @if (showError && errorMessage) {
        <div class="invalid-feedback d-block">{{ errorMessage }}</div>
      }

      <!-- DROPDOWN -->
      <c-dropdown [visible]="open" class="w-100 mt-1">
        <ul cDropdownMenu class="w-100 p-0" style="max-height: 250px; overflow:auto;">
          
          <!-- LOADING -->
          @if (loading()) {
            <li class="p-2 text-center text-muted">
              <c-spinner size="sm"></c-spinner>
            </li>
          }

          <!-- SIN RESULTADOS -->
          @else if (!loading() && data().length === 0) {
            <li class="p-2 text-muted">Sin resultados</li>
          }

          <!-- LISTA -->
          @else {
            @for(item of data(); track $index){
              <li cDropdownItem (click)="selectItem(item)">
                {{ item[bindLabel] }}
                @if (item.stock_actual !== undefined) {
                  <span class="text-muted small ms-2">
                    Stock: {{ item.stock_actual }}
                  </span>
                }
              </li>
            }
          }
        </ul>
      </c-dropdown>
    </div>
  `,
})
export class SearchSelectComponent implements OnInit, OnChanges {

  @Input() placeholder: string = 'Buscar...';
  @Input() bindLabel: string = 'label';
  @Input() bindValue: string = 'value';
  @Input() serviceFn!: (term: string) => any;
  @Input() disabled: boolean = false;
  @Input() showError: boolean = false;
  @Input() errorMessage: string = '';

  @Input() initialValue: string = '';

  @Output() itemSelected = new EventEmitter<any>();
  @Output() cleared = new EventEmitter<void>();
  @Output() onFocus = new EventEmitter<void>();

  searchCtrl = new FormControl('');
  open = false;

  loading = signal(false);
  data = signal<any[]>([]);

  // referencia al contenedor para detectar clicks afuera
  container = viewChild<ElementRef>('container');

  ngOnInit(): void {
    this.setupSearchListener();
    if (this.initialValue) {
      this.searchCtrl.setValue(this.initialValue, { emitEvent: false });
    }
  }

  // -----------------------------
  // LISTENER PRINCIPAL
  // -----------------------------
  setupSearchListener() {
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap((value) => {
          if (!value) {
            this.data.set([]);
            this.cleared.emit();
            return;
          }
          this.loading.set(true);
        }),
        switchMap((term) => this.serviceFn(term || ''))
      )
      .subscribe((resp: any) => {
        const parsed = resp.data || resp;
        this.data.set(parsed);
        this.loading.set(false);
      });
  }

  // -----------------------------
  // SELECTOR
  // -----------------------------
  selectItem(item: any) {
    this.itemSelected.emit(item);
    this.searchCtrl.setValue(item[this.bindLabel], { emitEvent: false });
    this.closeDropdown();
  }

  // -----------------------------
  // CONTROL DE DROPDOWN
  // -----------------------------
  openDropdown() {
    this.open = true;
  }

  closeDropdown() {
    this.open = false;
  }

  onInputFocus() {
    this.openDropdown();
    this.onFocus.emit();
  }

  // -----------------------------
  // CLICK FUERA → cerrar dropdown
  // -----------------------------
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.container()?.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.searchCtrl.disable();
      } else {
        this.searchCtrl.enable();
      }
    }
    if (changes['initialValue'] && !changes['initialValue'].firstChange) {
      this.searchCtrl.setValue(this.initialValue, { emitEvent: false });
    }
  }
}
