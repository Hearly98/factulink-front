import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { BaseSearchComponent } from '../../../shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { ProductoSucursalModal } from '../../components/product-sucursal-modal/product-sucursal-modal';
import { FilterForm } from '../../core/types';
import { GetProductoSucursalModel } from '../../core/models';
import { PaginatorComponent } from '../../../paginator/paginator.component';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ProductoSucursalService } from '../../core/services/product-sucursal.service';
import { ProductService } from '../../../products/core/services/product.service';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { CommonModule } from '@angular/common';
import { GetProductModel } from '../../../products/core/models';
import { GetSucursalModel } from '../../../sucursal/core/models';

@Component({
    selector: 'app-product-sucursal',
    standalone: true,
    imports: [
        CommonModule,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        IconDirective,
        ButtonDirective,
        TableDirective,
        ReactiveFormsModule,
        ProductoSucursalModal,
        PaginatorComponent,
    ],
    templateUrl: './product-sucursal.html',
})
export class ProductoSucursal extends BaseSearchComponent {
    @ViewChild('productoSucursalModal') productoSucursalModal!: ProductoSucursalModal;
    public form!: TypedFormGroup<FilterForm>;
    #formBuilder = inject(FormBuilder);
    public title = 'Stock por Sucursal';
    #productoSucursalService = inject(ProductoSucursalService);
    #productService = inject(ProductService);
    #sucursalService = inject(SucursalService);
    public productSucursals: GetProductoSucursalModel[] = [];
    public productos: GetProductModel[] = [];
    public sucursales: GetSucursalModel[] = [];
    #confirmService = inject(ConfirmService);
    #globalNotification = inject(GlobalNotification);

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.PRODUCT_SUCURSAL, viewContainerRef);
    }

    ngOnInit(): void {
        this.createForm();
        this.loadSelectCombos();
        this.onSearch();
    }

    loadSelectCombos() {
        this.#productService.getAll().subscribe((res: any) => {
            if (res.isValid) this.productos = res.data;
        });
        this.#sucursalService.getAll().subscribe((res: any) => {
            if (res.isValid) this.sucursales = res.data;
        });
    }

    createForm() {
        this.form = this.#formBuilder.group(buildFilterForm()) as TypedFormGroup<FilterForm>;
    }

    onSearch(filter = null, page = 1) {
        const sort = filterSort(this.form.value);
        const filterToUse = filter || mapParams(this.form.value);
        const pageSize = 10;
        const pageParams = new PageParamsModel(page, pageSize);
        this.updateFilter(filterToUse);
        this.updateSort(sort);
        this.updatePage(pageParams);
        const params = this.getPageParams();
        const subscription = this.#productoSucursalService.search(params).subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.total = response.data.total;
                    this.productSucursals = response.data.items;
                } else {
                    console.error(response);
                }
            },
            error: (response) => {
                console.error(response.messages);
            },
        });
        this.subscriptions.push(subscription);
    }

    onPageChange(page: number): void {
        this.onSearch(this.filter, page);
    }

    onClean() {
        this.form.reset({ est: true });
        this.onSearch();
    }

    openModal(id?: number) {
        if (this.productoSucursalModal) {
            this.productoSucursalModal.openModal(id, () => {
                this.onSearch();
            });
        }
    }

    onDelete(id: number) {
        this.#confirmService
            .open({
                title: 'Eliminar',
                message: '¿Estás seguro de desactivar esta asignación?',
                color: 'danger',
                confirmText: 'Si, desactivar',
                cancelText: 'Cancelar',
            })
            .then((confirmed) => {
                if (confirmed) {
                    this.#productoSucursalService.delete(id).subscribe({
                        next: (response) => {
                            if (response.isValid) {
                                this.#globalNotification.openAlert(response);
                                this.onSearch();
                            } else {
                                this.#globalNotification.openAlert(response);
                            }
                        },
                        error: (response) => {
                            this.#globalNotification.openToastAlert('Error al desactivar', response, 'danger');
                        },
                    });
                }
            });
    }
}
