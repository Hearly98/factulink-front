import { Component, Inject, inject, OnInit, ViewContainerRef, signal, computed } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { BaseComponent } from '../../../shared/base/base.component';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { MovimientoFacade } from '../../core/services/movimiento.facade';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators, FormGroup } from '@angular/forms';
import {
  buildMovimientoForm,
  movimientoStructure,
  movimientoErrorMessages,
  MovimientoField,
  movimientoValidatorStrategy,
  MovimientoTipo,
} from '../../helpers';
import { GetAlmacenModel } from '../../../almacen/core/models';
import { GetProductModel } from '../../../products/core/models';
import { GetMovimientoModel } from '../../core/models/movimiento.model';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { CommonModule } from '@angular/common';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ValidationMessagesComponent } from '@shared/components/error-messages/validation-messages.component';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';

@Component({
  selector: 'app-movimiento-main',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    TableDirective,
    ColComponent,
    ContainerComponent,
    IconDirective,
    ButtonDirective,
    ValidationMessagesComponent,
    SpinnerComponent,
    PaginatorComponent,
  ],
  templateUrl: './movimiento-main.page.html',
})
export class MovimientoMainPage extends BaseComponent implements OnInit {
  public activeTab = signal<'create' | 'history'>('create');
  public form: any;
  public formList!: FormGroup;
  public structure = movimientoStructure;
  public fields = signal<MovimientoField[]>(movimientoStructure);
  public filteredFields = computed(() => {
    const tipo = this.form?.get('mov_tip')?.value;
    return this.fields().filter(f => !f.visibleWhen || f.visibleWhen === tipo);
  });
  readonly messages = movimientoErrorMessages();

  public almacenes: GetAlmacenModel[] = [];
  public productos: GetProductModel[] = [];
  public movimientos: GetMovimientoModel[] = [];
  public total = 0;
  public totalList = 0;
  public pageList = new PageParamsModel(1, 10);
  public isLoading = signal(false);
  public isLoadingList = signal(false);
  public isLoadingCombos = signal(true);

  readonly #formBuilder = inject(FormBuilder);
  readonly #facade = inject(MovimientoFacade);
  readonly #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.MOVIMIENTO, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.createFormList();
    this.loadCombos();
    this.onSearchList();
  }

  createFormList() {
    this.formList = this.#formBuilder.group({
      fecha_desde: [''],
      fecha_hasta: [''],
      mov_tip: [null],
      alm_id: [null],
      search: [''],
    });
  }

  onSearchList(filter: any = null, page = 1) {
    const filterToUse = filter || this.formList?.value || {};

    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);
    this.pageList = pageParams;

    const sort = [{ property: 'mov_fecha', direction: 'desc' }];

    const params = {
      filter: filterToUse,
      page: { page, pageSize },
      sort,
    };

    this.isLoadingList.set(true);
    this.#facade.search(params).subscribe({
      next: (response: any) => {
        this.isLoadingList.set(false);
        if (response.isValid && response.data) {
          this.totalList = response.data.total ?? 0;
          this.movimientos = Array.isArray(response.data.items) ? response.data.items : [];
        } else {
          this.movimientos = [];
          this.totalList = 0;
        }
      },
      error: () => {
        this.isLoadingList.set(false);
        this.movimientos = [];
        this.totalList = 0;
      },
    });
  }

  onCleanList() {
    if (this.formList) {
      this.formList.reset();
    }
    this.onSearchList();
  }

  onPrint(id: number) {
    this.#globalNotification.openToastAlert('Info', 'Impresión en desarrollo', 'info');
  }

  onEdit(id: number) {
    this.activeTab.set('create');
  }

  createForm() {
    this.form = this.#formBuilder.group(buildMovimientoForm()) as any;

    this.form.get('mov_tip')?.valueChanges.subscribe((val: any) => {
      if (val) this.updateValidators(val);
    });

    this.updateValidators('TRANSFERENCIA');
  }

  updateValidators(tipo: string) {
    const validators = movimientoValidatorStrategy.getValidators(tipo as MovimientoTipo);
    const almOri = this.form.get('alm_id_ori');
    const almDes = this.form.get('alm_id_des');

    const oriValidators = validators.filter(v => (v as any).key === 'alm_id_ori');
    const desValidators = validators.filter(v => (v as any).key === 'alm_id_des');

    if (tipo === 'SALIDA') {
      this.form.patchValue({ con_gui_rem: false });
    }

    almOri?.setValidators(oriValidators.length > 0 ? oriValidators : []);
    almDes?.setValidators(desValidators.length > 0 ? desValidators : []);

    almOri?.updateValueAndValidity();
    almDes?.updateValueAndValidity();
  }

  loadCombos() {
    this.#facade.loadCombos().subscribe({
      next: (response: any) => {
        if (response.isValid) {
          this.almacenes = response.data.almacenes || [];
          this.productos = response.data.productos || [];
        }
        this.isLoadingCombos.set(false);
      },
      error: () => {
        this.isLoadingCombos.set(false);
        this.#globalNotification.openToastAlert('Error', 'No se pudieron cargar los datos', 'danger');
      },
    });
  }

  onSearch(page = 1) {
    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);

    const filterToUse = {};
    const sort = [{ property: 'mov_fecha', direction: 'desc' }];

    const params = {
      filter: filterToUse,
      page: { page, pageSize },
      sort,
    };

    this.#facade.search(params).subscribe({
      next: (response: any) => {
        if (response.isValid && response.data) {
          this.total = response.data.total ?? 0;
          this.movimientos = Array.isArray(response.data.items) ? response.data.items : [];
        } else {
          this.movimientos = [];
          this.total = 0;
        }
      },
      error: () => {
        this.movimientos = [];
        this.total = 0;
      },
    });
  }

  onPageChange(page: number) {
    this.onSearchList(null, page);
  }

  get detailsArray() {
    return this.form.get('details') as FormArray;
  }

  addProduct() {
    const prodId = this.form.get('temp_prod_id')?.value;
    const cant = this.form.get('temp_cant')?.value || 0;

    if (!prodId || cant <= 0) return;

    const product = this.productos.find((p) => p.prod_id === Number(prodId));
    if (!product) return;

    const exists = this.detailsArray.controls.some(
      (c) => c.get('prod_id')?.value === product.prod_id
    );
    if (exists) {
      this.#globalNotification.openToastAlert('Aviso', 'El producto ya está en la lista', 'warning');
      return;
    }

    this.detailsArray.push(
      this.#formBuilder.group({
        prod_id: [product.prod_id, Validators.required],
        prod_nom: [product.prod_nom],
        prod_cod_interno: [product.prod_cod_interno],
        cant: [cant, [Validators.required, Validators.min(1)]],
      })
    );

    this.form.patchValue({ temp_prod_id: null, temp_cant: 1 });
  }

  removeDetail(index: number) {
    this.detailsArray.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.detailsArray.length === 0) {
      this.#globalNotification.openToastAlert('Error', 'Debe agregar al menos un producto', 'danger');
      return;
    }

    this.isLoading.set(true);
    const body = this.form.value;

    const request = body.mov_id
      ? this.#facade.update(body)
      : this.#facade.create(body);

    request.subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.form.reset();
          this.createForm();
          this.detailsArray.clear();
          this.activeTab.set('history');
          this.onSearch();
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.#globalNotification.openToastAlert('Error', err.error?.message || 'Error al procesar', 'danger');
      },
    });
  }
}
