import { Component, Inject, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  RowComponent,
} from '@coreui/angular';
import { ProductService } from '../../core/services/product.service';
import { IconDirective } from '@coreui/icons-angular';
import { buildProductForm, productStructure } from '../../helpers';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { ProductForm } from '../../core/types/product-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { CreateProductModel, UpdateProductModel } from '../../core/models';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { GetSucursalModel } from '../../../sucursal/core/models';
import { CategoryService } from '../../../category/core/services/category.service';
import { GetCategoryModel } from '../../../category/core/models';
import { CurrencyService } from '../../../currency/core/services/currency.service';
import { GetCurrencyModel } from '../../../currency/core/models/get-currency.model';
import { UnitOfMeasureService } from '../../../unit-of-measure/core/services/unit-of-measure.service';
import { GetUnitOfMeasureModel } from '../../../unit-of-measure/core/models';
import { SucursalSelectorModalComponent } from '../../../shared/components/sucursal-selector-modal.component';

@Component({
  selector: 'app-product-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalBodyComponent,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ModalFooterComponent,
    ReactiveFormsModule,
    SucursalSelectorModalComponent,
  ],
  templateUrl: './product-new-edit-modal.html',
  styleUrl: './product-new-edit-modal.scss',
})
export class ProductNewEditModal extends BaseComponent implements OnInit {
  @ViewChild(SucursalSelectorModalComponent) sucursalSelector!: SucursalSelectorModalComponent;
  form!: FormGroup;
  visible = false;
  structure = productStructure;
  sucursales: GetSucursalModel[] = [];
  categorias: GetCategoryModel[] = [];
  monedas: GetCurrencyModel[] = [];
  unidades: GetUnitOfMeasureModel[] = [];
  #sucursalService = inject(SucursalService);
  #categoryService = inject(CategoryService);
  #currencyService = inject(CurrencyService);
  #unidadService = inject(UnitOfMeasureService);
  #globalNotification = inject(GlobalNotification);
  #productService = inject(ProductService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Producto';
  callback: any;
  isEditMode = false;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PRODUCT, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.loadSelectCombos();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildProductForm());
  }

  openModal(idProduct?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    this.isEditMode = !!idProduct;
    if (idProduct) {
      this.title = 'Editar Producto';
      this.loadData(idProduct);
    } else {
      this.title = 'Crear Producto';
    }
  }

  openSucursalSelector() {
    const currentSucursales = this.form.get('sucursales')?.value || [];
    this.sucursalSelector.openModal(currentSucursales, (selectedIds: number[]) => {
      this.form.patchValue({ sucursales: selectedIds });
    });
  }

  getSucursalNames(): string {
    const selectedIds = this.form.get('sucursales')?.value || [];
    if (selectedIds.length === 0) return 'Ninguna sucursal seleccionada';

    const names = this.sucursales
      .filter(s => selectedIds.includes(s.suc_id))
      .map(s => s.suc_nom);

    return names.join(', ');
  }

  loadData(idProduct: number) {
    this.#productService.getById(idProduct).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  loadSelectCombos() {
    this.fetchData(this.#sucursalService.getAll(), this.sucursales);
    this.fetchData(this.#categoryService.getAll(), this.categorias);
    this.fetchData(this.#currencyService.getAll(), this.monedas);
    this.fetchData(this.#unidadService.getAll(), this.unidades);
  }

  onClose() {
    this.visible = false;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.prod_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { prod_id, ...body } = this.form.value;
    // Include sucursales only on creation
    const createData = {
      ...body,
      sucursales: body.sucursales || []
    };

    const subscription = this.#productService.create(createData as CreateProductModel).subscribe({
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
    // Exclude sucursales from update
    const { sucursales, ...updateData } = this.form.value;

    const subscription = this.#productService
      .update(updateData as UpdateProductModel)
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

  getDataSource(item: any): any[] {
    switch (item.dataSource) {
      case 'sucursales':
        return this.sucursales;
      case 'categorias':
        return this.categorias;
      case 'monedas':
        return this.monedas;
      case 'unidades':
        return this.unidades;
      default:
        return [];
    }
  }

  getDisplayField(item: any, dataItem: any): string {
    switch (item.dataSource) {
      case 'sucursales':
        return dataItem.suc_nom;
      case 'categorias':
        return dataItem.cat_nom;
      case 'monedas':
        return dataItem.mon_nom;
      case 'unidades':
        return dataItem.und_nom;
      default:
        return '';
    }
  }

  getIdField(item: any, dataItem: any): number {
    switch (item.dataSource) {
      case 'sucursales':
        return dataItem.suc_id;
      case 'categorias':
        return dataItem.cat_id;
      case 'monedas':
        return dataItem.mon_id;
      case 'unidades':
        return dataItem.und_id;
      default:
        return 0;
    }
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files && input.files.length > 0 ? input.files[0] : null;
    if (!file) return;

    this.form.patchValue({ prod_img: file });
  }
}
