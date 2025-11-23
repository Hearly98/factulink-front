import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownModule,
  SpinnerComponent,
} from '@coreui/angular';

import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, SpinnerComponent],
  template: `
    <div class="position-relative">
      <!-- INPUT -->
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder"
        [formControl]="searchCtrl"
        (focus)="open = true"
      />

      <!-- SPINNER -->
      @if(loading()){
      <c-spinner
        class="position-absolute end-0 top-50 translate-middle-y me-2"
        size="sm"
      ></c-spinner>

      }@else {
      <div class="p-2 text-muted">Sin resultados</div>
      }
      <!-- DROPDOWN -->
      <c-dropdown [visible]="open" class="w-100 mt-1">
        <ul class="w-100" style="max-height: 250px; overflow:auto;">
          @for(item of data(); track $index){
          <li cDropdownItem (click)="selectItem(item)">
            {{ item[bindLabel] }}
          </li>
          }
        </ul>
      </c-dropdown>
    </div>
  `,
})
export class SearchSelectComponent implements OnInit {
  @Input() placeholder: string = 'Buscar...';

  @Input() bindLabel: string = 'nombre'; // campo visible
  @Input() bindValue: string = 'id'; // valor a devolver

  @Input() serviceFn!: (term: string) => any; // función que llama al backend

  @Output() itemSelected = new EventEmitter<any>();

  searchCtrl = new FormControl('');
  open = false;

  loading = signal(false);
  data = signal<any[]>([]);

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
        }),
        switchMap((term) => this.serviceFn(term || ''))
      )
      .subscribe((resp: any) => {
        this.data.set(resp.data || resp); // soporta resp.data o arreglo directo
        this.loading.set(false);
      });
  }

  selectItem(item: any) {
    this.itemSelected.emit(item[this.bindValue]);
    this.open = false;
    this.searchCtrl.setValue(item[this.bindLabel], { emitEvent: false });
  }
}
