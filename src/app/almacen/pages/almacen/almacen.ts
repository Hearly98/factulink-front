import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import {
    ButtonDirective,
    ButtonGroupModule,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    TableDirective,
    FormSelectDirective,
    FormControlDirective,
    FormLabelDirective,
    BadgeComponent,
    CardHeaderComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseSearchComponent } from '../../../shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { AlmacenModal } from '../../components/almacen-modal/almacen-modal';
import { FilterForm } from '../../core/types';
import { GetAlmacenModel } from '../../core/models';
import { PaginatorComponent } from '../../../paginator/paginator.component';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { AlmacenService } from '../../core/services/almacen.service';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { CommonModule } from '@angular/common';
import { GetSucursalModel } from '../../../sucursal/core/models';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { Router } from '@angular/router';

@Component({
    selector: 'app-almacen',
    standalone: true,
    imports: [
        CommonModule,
        RowComponent,
        ColComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        IconDirective,
        ButtonDirective,
        ButtonGroupModule,
        TableDirective,
        ReactiveFormsModule,
        AlmacenModal,
        PaginatorComponent,
        FormSelectDirective,
        FormLabelDirective,
        BadgeComponent,
        CommonModule
    ],
    templateUrl: './almacen.html',
})
export class AlmacenComponent extends BaseSearchComponent {
    @ViewChild('almacenModal') almacenModal!: AlmacenModal;
    public form!: TypedFormGroup<FilterForm>;
    readonly #formBuilder = inject(FormBuilder);
    public title = 'Listado de Almacenes';
    readonly #almacenService = inject(AlmacenService);
    readonly #sucursalService = inject(SucursalService);
    readonly #router = inject(Router);

    public almacenes: GetAlmacenModel[] = [];
    public sucursales: GetSucursalModel[] = [];
    public viewMode: 'cards' | 'table' = 'cards';

    #confirmService = inject(ConfirmService);
    #globalNotification = inject(GlobalNotification);

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.ALMACEN, viewContainerRef);
    }

    ngOnInit(): void {
        this.createForm();
        this.loadSucursales();
        this.onSearch();
    }

    loadSucursales() {
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
        const subscription = this.#almacenService.search(params).subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.total = response.data.total;
                    this.almacenes = response.data.items;
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
        this.form.reset({ activo: true, order: 'desc' });
        this.onSearch();
    }

    openModal(id?: number) {
        if (this.almacenModal) {
            this.almacenModal.openModal(id, () => {
                this.onSearch();
            });
        }
    }

    viewStock(almacen: GetAlmacenModel) {
        this.#router.navigate(['/almacen-stock', almacen.almacen_id]);
    }

    onDelete(id: number) {
        this.#confirmService
            .open({
                title: 'Eliminar',
                message: '¿Estás seguro de desactivar este almacén?',
                color: 'danger',
                confirmText: 'Si, desactivar',
                cancelText: 'Cancelar',
            })
            .then((confirmed) => {
                if (confirmed) {
                    this.#almacenService.delete(id).subscribe({
                        next: (response) => {
                            if (response.isValid) {
                                this.#globalNotification.openAlert(response);
                                this.onSearch();
                            } else {
                                this.#globalNotification.openAlert(response);
                            }
                        },
                        error: (response) => {
                            this.#globalNotification.openToastAlert('Error al desactivar', response.error?.message || 'Error', 'danger');
                        },
                    });
                }
            });
    }

    setViewMode(mode: 'cards' | 'table') {
        this.viewMode = mode;
    }
}
