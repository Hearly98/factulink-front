import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  SpinnerComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { SelectOption } from '@shared/types';
import { TypedFormGroup } from '@shared/types/types-form';
import { SearchSelectComponent } from '@shared/components/search-select.component';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { ShippingGuideService } from '../core/services/shipping-guide.service';
import { ShippingGuideModel } from '../core/models/shipping-guide.model';
import { shippingGuideStructure, ShippingGuideStructureSection } from '../helpers/shipping-guide-structure';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { CustomerService } from 'src/app/customer/core/services/customer.service';
import { ProductService } from 'src/app/products/core/services/product.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';

interface ShippingGuideDetailForm {
  prod_id: number;
  prod_nom: string;
  cantidad: number;
  peso_unitario: number;
  descripcion: string;
}

@Component({
  selector: 'app-shipping-guide-main',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    IconDirective,
    ButtonDirective,
    ReactiveFormsModule,
    SearchSelectComponent,
    TableDirective,
    TextColorDirective,
    SpinnerComponent,
    PaginatorComponent,
    DatePipe,
  ],
  templateUrl: './shipping-guide-main.page.html',
})
export class ShippingGuideMainPage extends BaseSearchComponent implements OnInit {
  public activeTab = signal<'create' | 'history'>('create');

  public isLoadingList = signal(false);
  public guides: ShippingGuideModel[] = [];
  public totalList = 0;
  public pageList = new PageParamsModel(1, 10);

  public isLoadingForm = signal(false);
  public form!: FormGroup;
  public selectedProduct: any = null;
  public guideId = signal<number | null>(null);

  public structure = signal<ShippingGuideStructureSection[]>(shippingGuideStructure());
  public title = signal<string>('Guías de Remisión');

  series: SelectOption[] = [];
  sucursales: SelectOption[] = [];

  readonly #formBuilder = inject(FormBuilder);
  readonly #shippingGuideService = inject(ShippingGuideService);
  readonly #customerService = inject(CustomerService);
  readonly #productService = inject(ProductService);
  readonly #sucursalService = inject(SucursalService);
  readonly #globalNotification = inject(GlobalNotification);
  readonly #confirmService = inject(ConfirmService);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit(): void {
    this.formList = this.#formBuilder.group({
      fecha_desde: [''],
      fecha_hasta: [''],
      suc_id: [null],
      search: [''],
    });

    this.loadForm();
    this.loadListData();
  }

  loadForm() {
    this.form = this.#formBuilder.group({
      serie_id: [null],
      fecha_emision: [new Date().toISOString().split('T')[0]],
      fecha_inicio_traslado: [new Date().toISOString().split('T')[0]],
      partida_ubigeo: [''],
      partida_direccion: [''],
      destino_ubigeo: [''],
      destino_direccion: [''],
      cli_id: [null],
      tipo_traslado: ['PRIVADO'],
      motivo_traslado: [''],
      transportista_tipo_doc: ['DNI'],
      transportista_nro_doc: [''],
      transportista_licencia: [''],
      transportista_placa: [''],
      empresa_transporte_tipo_doc: ['RUC'],
      empresa_transporte_nro_doc: [''],
      empresa_transporte_razon_social: [''],
      nro_cotizacion: [''],
      nro_oc: [''],
      nro_factura: [''],
      prod_id: [null],
      cantidad: [1],
      observaciones: [''],
      detalles: this.#formBuilder.array([]),
    });
    this.loadSelectCombos();
  }

  loadListData() {
    this.onSearch();
  }

  get detailsArray(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  serviceMap: Record<string, (term: string) => any> = {
    customerSearch: (term: string) => this.#customerService.searchQuick(term),
    productSearch: (term: string) => this.#productService.searchQuick({ term }),
  };

  getServiceFn(serviceFnName?: string): (term: string) => any {
    if (!serviceFnName) return () => [];
    return this.serviceMap[serviceFnName] || (() => []);
  }

  onSelectItem(formControlName: string, item: any) {
    if (!item) return;

    if (formControlName === 'prod_id') {
      this.form.patchValue({
        prod_id: item.prod_id,
      });
      this.selectedProduct = item;
      return;
    }

    const control = this.form.get(formControlName);
    if (control) {
      control.setValue(item[formControlName]);
    }
  }

  addProductToDetail() {
    if (!this.selectedProduct) return;

    const cantidad = this.form.get('temp_cantidad')?.value || 1;

    const exists = this.detailsArray.controls.some(
      (control) => control.value.prod_id === this.selectedProduct.prod_id
    );

    if (exists) {
      this.#globalNotification.openToastAlert('Aviso', 'Este producto ya ha sido agregado', 'warning');
      return;
    }

    const detailForm = this.#formBuilder.group({
      prod_id: [this.selectedProduct.prod_id],
      prod_nom: [this.selectedProduct.prod_nom],
      cantidad: [cantidad],
      peso_unitario: [0],
      descripcion: [''],
    });

    this.detailsArray.push(detailForm);

    this.form.get('prod_id')?.setValue(null);
    this.form.get('temp_cantidad')?.setValue(1);
    this.selectedProduct = null;
  }

  onDetailRemoved(index: number) {
    this.detailsArray.removeAt(index);
  }

  loadSelectCombos() {
    this.#shippingGuideService.getSeries().subscribe({
      next: (response) => {
        this.series = response.data.map((item) => ({
          value: item.ser_id,
          label: item.ser_num,
        }));
        this.updateStructure();
      },
    });

    this.#sucursalService.getAll().subscribe({
      next: (response) => {
        this.sucursales = response.data.map((item) => ({
          value: item.suc_id,
          label: item.suc_nom,
        }));
        this.updateStructure();
      },
    });
  }

  updateStructure() {
    this.structure.set(
      shippingGuideStructure(this.series, this.sucursales)
    );
  }

  save() {
    if (this.form.invalid || this.detailsArray.length === 0) {
      this.#globalNotification.openToastAlert('Validación', 'Complete todos los campos requeridos y agregue al menos un producto');
      this.form.markAllAsTouched();
      return;
    }

    const guideData = {
      serie_id: this.form.value.serie_id,
      emp_id: 1,
      suc_id: this.form.value.suc_id || this.sucursales[0]?.value,
      fecha_emision: this.form.value.fecha_emision,
      fecha_inicio_traslado: this.form.value.fecha_inicio_traslado,
      partida_ubigeo: this.form.value.partida_ubigeo,
      partida_direccion: this.form.value.partida_direccion,
      destino_ubigeo: this.form.value.destino_ubigeo,
      destino_direccion: this.form.value.destino_direccion,
      cli_id: this.form.value.cli_id,
      tipo_traslado: this.form.value.tipo_traslado,
      motivo_traslado: this.form.value.motivo_traslado,
      transportista_tipo_doc: this.form.value.transportista_tipo_doc,
      transportista_nro_doc: this.form.value.transportista_nro_doc,
      transportista_licencia: this.form.value.transportista_licencia,
      transportista_placa: this.form.value.transportista_placa,
      empresa_transporte_tipo_doc: this.form.value.empresa_transporte_tipo_doc,
      empresa_transporte_nro_doc: this.form.value.empresa_transporte_nro_doc,
      empresa_transporte_razon_social: this.form.value.empresa_transporte_razon_social,
      nro_cotizacion: this.form.value.nro_cotizacion,
      nro_oc: this.form.value.nro_oc,
      nro_factura: this.form.value.nro_factura,
      observaciones: this.form.value.observaciones,
      detalles: this.detailsArray.getRawValue().map((v) => ({
        prod_id: v.prod_id,
        cantidad: v.cantidad,
        peso_unitario: v.peso_unitario,
        descripcion: v.descripcion,
      })),
    };

    this.isLoadingForm.set(true);

    const request = this.guideId()
      ? this.#shippingGuideService.update(this.guideId()!, guideData)
      : this.#shippingGuideService.create(guideData);

    request.subscribe({
      next: (response) => {
        this.isLoadingForm.set(false);
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.resetForm();
          this.activeTab.set('history');
          this.onSearch();
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (error) => {
        this.isLoadingForm.set(false);
        this.#globalNotification.openToastAlert('Error', error.messages || 'Error al guardar', 'danger');
      },
    });
  }

  resetForm() {
    this.form.reset();
    this.detailsArray.clear();
    this.guideId.set(null);
    this.selectedProduct = null;
    this.form.patchValue({
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_inicio_traslado: new Date().toISOString().split('T')[0],
      tipo_traslado: 'PRIVADO',
      transportista_tipo_doc: 'DNI',
      empresa_transporte_tipo_doc: 'RUC',
      temp_cantidad: 1,
    });
  }

  formList!: FormGroup;

  onSearch(filter = null, page: number = 1) {
    if (!this.formList) {
      this.formList = this.#formBuilder.group({
        fecha_desde: [''],
        fecha_hasta: [''],
        suc_id: [null],
        search: [''],
      });
    }

    const filterToUse = filter || {
      ...this.formList.value,
    };

    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);

    this.pageList = pageParams;

    const params = this.getPageParams();

    this.isLoadingList.set(true);
    this.#shippingGuideService.search(params).subscribe({
      next: (response) => {
        this.isLoadingList.set(false);
        if (response.isValid) {
          this.totalList = response.data.total;
          this.guides = response.data.items;
        }
      },
      error: () => {
        this.isLoadingList.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.onSearch(null, page);
  }

  onClean() {
    if (this.formList) {
      this.formList.reset();
    }
    this.onSearch();
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Eliminar',
        message: '¿Estás seguro de eliminar esta guía de remisión?',
        color: 'danger',
        confirmText: 'Si, eliminar',
        cancelText: 'Cancelar',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.#shippingGuideService.delete(id).subscribe({
            next: (response) => {
              if (response.isValid) {
                this.#globalNotification.openAlert(response);
                this.onSearch();
              } else {
                this.#globalNotification.openAlert(response);
              }
            },
            error: (response) => {
              this.#globalNotification.openToastAlert('Error al eliminar', response.messages || 'Error', 'danger');
            },
          });
        }
      });
  }

  onPrint(id: number, numero: string) {
    this.#shippingGuideService.print(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `${numero}.pdf`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^";\\n]*)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.#globalNotification.openAlert(error.error);
      },
    });
  }

  onEdit(id: number) {
    this.activeTab.set('create');
    this.guideId.set(id);
    this.#shippingGuideService.getById(id).subscribe({
      next: (response) => {
        if (response.isValid) {
          const guia = response.data;
          this.form.patchValue({
            serie_id: guia.serie_id,
            fecha_emision: guia.fecha_emision,
            fecha_inicio_traslado: guia.fecha_inicio_traslado,
            partida_ubigeo: guia.partida_ubigeo,
            partida_direccion: guia.partida_direccion,
            destino_ubigeo: guia.destino_ubigeo,
            destino_direccion: guia.destino_direccion,
            cli_id: guia.cliente?.cli_id,
            tipo_traslado: guia.tipo_traslado,
            motivo_traslado: guia.motivo_traslado,
            transportista_tipo_doc: guia.transportista_tipo_doc,
            transportista_nro_doc: guia.transportista_nro_doc,
            transportista_licencia: guia.transportista_licencia,
            transportista_placa: guia.transportista_placa,
            empresa_transporte_tipo_doc: guia.empresa_transporte_tipo_doc,
            empresa_transporte_nro_doc: guia.empresa_transporte_nro_doc,
            empresa_transporte_razon_social: guia.empresa_transporte_razon_social,
            nro_cotizacion: guia.nro_cotizacion,
            nro_oc: guia.nro_oc,
            nro_factura: guia.nro_factura,
            observaciones: guia.observaciones,
          });

          this.detailsArray.clear();
          guia.detalles?.forEach((detalle: any) => {
            const detailForm = this.#formBuilder.group({
              prod_id: [detalle.prod_id],
              prod_nom: [detalle.producto?.prod_nom || ''],
              cantidad: [detalle.cantidad],
              peso_unitario: [detalle.peso_unitario],
              descripcion: [detalle.descripcion],
            });
            this.detailsArray.push(detailForm);
          });
        }
      },
    });
  }
}
