import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
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
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { ProductoSucursalService } from '../../core/services/product-sucursal.service';
import { ProductService } from '../../../products/core/services/product.service';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { GetProductModel } from '../../../products/core/models';
import { GetSucursalModel } from '../../../sucursal/core/models';
import { buildProductoSucursalForm, ProductoSucursalStructure } from '../../helpers';
import { CreateProductoSucursalModel, UpdateProductoSucursalModel } from '../../core/models';
import { CommonModule } from '@angular/common';
import { ProductoSucursalForm } from '../../core/types';

@Component({
    selector: 'app-product-sucursal-modal',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        CardBodyComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        RowComponent,
        ColComponent,
        ButtonDirective,
        IconDirective,
        ReactiveFormsModule,
    ],
    templateUrl: './product-sucursal-modal.html',
})
export class ProductoSucursalModal extends BaseComponent implements OnInit {
    form!: TypedFormGroup<ProductoSucursalForm>;
    visible = false;
    structure = ProductoSucursalStructure;
    productos: GetProductModel[] = [];
    sucursales: GetSucursalModel[] = [];

    #productoSucursalService = inject(ProductoSucursalService);
    #productService = inject(ProductService);
    #sucursalService = inject(SucursalService);
    #globalNotification = inject(GlobalNotification);
    #formBuilder = inject(FormBuilder);

    title = 'Asignar Producto a Sucursal';
    callback: any;

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.PRODUCT_SUCURSAL, viewContainerRef);
    }

    ngOnInit(): void {
        this.createForm();
        this.loadSelectCombos();
    }

    createForm() {
        this.form = this.#formBuilder.group(buildProductoSucursalForm()) as TypedFormGroup<ProductoSucursalForm>;
    }

    openModal(id?: number, callback: any = null) {
        this.createForm();
        this.visible = true;
        this.callback = callback;
        if (id) {
            this.title = 'Editar Asignación';
            this.loadData(id);
        } else {
            this.title = 'Asignar Producto a Sucursal';
        }
    }

    loadData(id: number) {
        this.#productoSucursalService.getById(id).subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.form.patchValue(response.data as any);
                }
            },
        });
    }

    loadSelectCombos() {
        this.fetchData(this.#productService.getAll(), this.productos);
        this.fetchData(this.#sucursalService.getAll(), this.sucursales);
    }

    onClose() {
        this.visible = false;
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.form.value.prodsuc_id) {
                this.update();
            } else {
                this.create();
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    create() {
        const { prodsuc_id, ...body } = this.form.value;
        const subscription = this.#productoSucursalService.create(body as CreateProductoSucursalModel).subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.#globalNotification.openAlert(response);
                    if (this.callback) this.callback(response.data);
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
        const subscription = this.#productoSucursalService
            .update(this.form.value as UpdateProductoSucursalModel)
            .subscribe({
                next: (response) => {
                    if (response.isValid) {
                        this.#globalNotification.openAlert(response);
                        if (this.callback) this.callback(response.data);
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
            case 'productos':
                return this.productos;
            case 'sucursales':
                return this.sucursales;
            default:
                return [];
        }
    }

    getDisplayField(item: any, dataItem: any): string {
        switch (item.dataSource) {
            case 'productos':
                return dataItem.prod_nom;
            case 'sucursales':
                return dataItem.suc_nom;
            default:
                return '';
        }
    }

    getIdField(item: any, dataItem: any): number {
        switch (item.dataSource) {
            case 'productos':
                return dataItem.prod_id;
            case 'sucursales':
                return dataItem.suc_id;
            default:
                return 0;
        }
    }
}
