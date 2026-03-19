import { Component, inject, Inject, OnInit, ViewContainerRef } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    ButtonDirective,
    FormSelectDirective,
    FormControlDirective,
    FormLabelDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    CollapseDirective,
    TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { MovimientoService } from '../../core/services/movimiento.service';
import { AlmacenService } from '../../../almacen/core/services/almacen.service';
import { ProductService } from '../../../products/core/services/product.service';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { GetAlmacenModel } from '../../../almacen/core/models';
import { GetProductModel } from '../../../products/core/models';
import { MovimientoModel, MovimientoDetailModel } from '../../core/models/movimiento.model';

@Component({
    selector: 'app-movimiento-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        CardComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        ButtonDirective,
        FormSelectDirective,
        FormControlDirective,
        FormLabelDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        CollapseDirective,
        TableDirective,
        IconDirective
    ],
    templateUrl: './movimiento-form.html',
})
export class MovimientoFormComponent extends BaseComponent implements OnInit {
    public form!: FormGroup;
    public almacenes: GetAlmacenModel[] = [];
    public productos: GetProductModel[] = [];
    public title = 'Nuevo Movimiento';
    public isEdit = false;

    #movimientoService = inject(MovimientoService);
    #almacenService = inject(AlmacenService);
    #productService = inject(ProductService);
    #formBuilder = inject(FormBuilder);
    #route = inject(ActivatedRoute);
    #router = inject(Router);
    #globalNotification = inject(GlobalNotification);

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.MOVIMIENTO, viewContainerRef);
    }

    ngOnInit(): void {
        this.createForm();
        this.loadCombos();

        const id = this.#route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.title = 'Editar Movimiento';
            this.loadMovimiento(Number(id));
        }
    }

    createForm() {
        this.form = this.#formBuilder.group({
            mov_id: [null],
            mov_fec: [new Date().toISOString().substring(0, 10), [Validators.required]],
            mov_tip: ['TRANSFERENCIA', [Validators.required]],
            alm_id_ori: [null],
            alm_id_des: [null],
            mov_mot: ['', [Validators.required]],
            mov_rec: [''],
            con_gui_rem: [false],
            gui_rem_num: [''],
            gui_rem_fec: [null],
            gui_rem_tra: [''],
            details: this.#formBuilder.array([]),
            // Helper form for adding products
            temp_prod_id: [null],
            temp_cant: [1]
        });

        this.form.get('mov_tip')?.valueChanges.subscribe(val => {
            this.updateValidators(val);
        });

        this.updateValidators('TRANSFERENCIA');
    }

    updateValidators(type: string) {
        const almOri = this.form.get('alm_id_ori');
        const almDes = this.form.get('alm_id_des');

        if (type === 'TRANSFERENCIA') {
            almOri?.setValidators([Validators.required]);
            almDes?.setValidators([Validators.required]);
        } else if (type === 'SALIDA') {
            almOri?.setValidators([Validators.required]);
            almDes?.clearValidators();
            this.form.patchValue({ con_gui_rem: false });
        } else { // INGRESO, AJUSTE, etc
            almOri?.clearValidators();
            almDes?.setValidators([Validators.required]);
        }

        almOri?.updateValueAndValidity();
        almDes?.updateValueAndValidity();
    }

    loadCombos() {
        this.#almacenService.getAll().subscribe(res => {
            if (res.isValid) this.almacenes = res.data;
        });
        this.#productService.getAll().subscribe(res => {
            if (res.isValid) this.productos = res.data;
        });
    }

    loadMovimiento(id: number) {
        this.#movimientoService.getById(id).subscribe(res => {
            if (res.isValid) {
                const { details, ...header } = res.data;
                this.form.patchValue(header);

                const detailsArray = this.form.get('details') as FormArray;
                detailsArray.clear();
                details.forEach(det => {
                    detailsArray.push(this.#formBuilder.group({
                        prod_id: [det.prod_id, [Validators.required]],
                        prod_nom: [det.prod_nom],
                        prod_cod: [det.prod_cod_interno],
                        cant: [det.cant, [Validators.required, Validators.min(1)]]
                    }));
                });
            }
        });
    }

    get detailsArray() {
        return this.form.get('details') as FormArray;
    }

    addProduct() {
        const prodId = this.form.get('temp_prod_id')?.value;
        const cant = this.form.get('temp_cant')?.value;

        if (!prodId || cant <= 0) return;

        const product = this.productos.find(p => p.prod_id === Number(prodId));
        if (!product) return;

        // Check if already exists
        const exists = this.detailsArray.controls.some(c => c.get('prod_id')?.value === product.prod_id);
        if (exists) {
            this.#globalNotification.openToastAlert('Aviso', 'El producto ya está en la lista', 'warning');
            return;
        }

        this.detailsArray.push(this.#formBuilder.group({
            prod_id: [product.prod_id, [Validators.required]],
            prod_nom: [product.prod_nom],
            prod_cod: [product.prod_cod_interno],
            cant: [cant, [Validators.required, Validators.min(1)]]
        }));

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

        const body = this.form.value;
        const call = this.isEdit ? this.#movimientoService.update(body) : this.#movimientoService.create(body);

        call.subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.#globalNotification.openAlert(res);
                    this.#router.navigate(['/movimientos']);
                }
            },
            error: (err) => {
                this.#globalNotification.openToastAlert('Error', err.error?.message || 'Error al procesar', 'danger');
            }
        });
    }
}
