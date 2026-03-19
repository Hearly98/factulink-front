import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RowComponent,
    ColComponent,
    FormSelectDirective,
    FormLabelDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { AlmacenForm } from '../../core/types';
import { AlmacenService } from '../../core/services/almacen.service';
import { buildAlmacenForm, AlmacenStructure } from '../../helpers';
import { CreateAlmacenModel, UpdateAlmacenModel } from '../../core/models';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { SucursalService } from '../../../sucursal/core/services/sucursal.service';
import { GetSucursalModel } from '../../../sucursal/core/models';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-almacen-modal',
    standalone: true,
    imports: [
        CommonModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        RowComponent,
        ColComponent,
        ButtonDirective,
        IconDirective,
        ReactiveFormsModule,
        FormSelectDirective,
        FormLabelDirective,
    ],
    templateUrl: './almacen-modal.html'
})
export class AlmacenModal extends BaseComponent implements OnInit {
    form!: TypedFormGroup<AlmacenForm>;
    visible = false;
    structure = AlmacenStructure;
    readonly #almacenService = inject(AlmacenService);
    readonly #sucursalService = inject(SucursalService);
    readonly #globalNotification = inject(GlobalNotification);
    readonly #formBuilder = inject(FormBuilder);
    title = 'Crear Almacén';
    callback: any;
    sucursales: GetSucursalModel[] = [];

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.ALMACEN, viewContainerRef);
    }

    ngOnInit(): void {
        this.createForm();
        this.loadSucursales();
    }

    loadSucursales() {
        this.#sucursalService.getAll().subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.sucursales = response.data;
                }
            }
        });
    }

    createForm() {
        this.form = this.#formBuilder.group(buildAlmacenForm()) as TypedFormGroup<AlmacenForm>;
    }

    openModal(idAlmacen?: number, callback: any = null) {
        this.createForm();
        this.callback = callback;
        this.visible = true;
        if (idAlmacen) {
            this.title = 'Editar Almacén';
            this.loadData(idAlmacen);
        } else {
            this.title = 'Crear Almacén';
        }
    }

    loadData(idAlmacen: number) {
        this.#almacenService.getById(idAlmacen).subscribe({
            next: (response) => {
                if (response.isValid) {
                    this.form.patchValue(response.data);
                }
            },
        });
    }

    onClose() {
        this.visible = false;
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.form.value.alm_id) {
                this.update();
            } else {
                this.create();
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    create() {
        const { alm_id, ...body } = this.form.value;
        const subscription = this.#almacenService.create(body as CreateAlmacenModel).subscribe({
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
                this.#globalNotification.openToastAlert('Error', error.error?.message || 'Error al crear', 'danger');
            },
        });
        this.subscriptions.push(subscription);
    }

    update() {
        const subscription = this.#almacenService
            .update(this.form.value as UpdateAlmacenModel)
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
                    this.#globalNotification.openToastAlert('Error', error.error?.message || 'Error al actualizar', 'danger');
                },
            });
        this.subscriptions.push(subscription);
    }
}
