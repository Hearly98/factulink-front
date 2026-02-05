import { Component, Inject, inject, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
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
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';
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
import { ImageCompressionService } from '../../../shared/services/image-compression.service';

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
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  isCompressing = signal<boolean>(false);
  #sucursalService = inject(SucursalService);
  #categoryService = inject(CategoryService);
  #currencyService = inject(CurrencyService);
  #unidadService = inject(UnitOfMeasureService);
  #globalNotification = inject(GlobalNotification);
  #productService = inject(ProductService);
  #formBuilder = inject(FormBuilder);
  #imageCompressionService = inject(ImageCompressionService);
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
    this.selectedFile = null;
    this.imagePreview.set(null);
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
    
    // Asegurar que siempre sea un array de números
    const sucursalesIds = currentSucursales.map((item: any) => {
      return typeof item === 'object' ? item.suc_id : Number(item);
    }).filter((id: number) => !isNaN(id));
    
    this.sucursalSelector.openModal(sucursalesIds, (selectedIds: number[]) => {
      this.form.patchValue({ sucursales: selectedIds });
    });
  }

  getSucursalNames(): string {
    const selectedIds = this.form.get('sucursales')?.value || [];
    if (selectedIds.length === 0) return 'Ninguna sucursal seleccionada';

    // Convertir a números si es necesario
    const ids = selectedIds.map((item: any) => {
      return typeof item === 'object' ? item.suc_id : Number(item);
    }).filter((id: number) => !isNaN(id));

    const names = this.sucursales
      .filter(s => ids.includes(s.suc_id))
      .map(s => s.suc_nom);

    return names.join(', ');
  }

  loadData(idProduct: number) {
    this.#productService.getById(idProduct).subscribe({
      next: (response) => {
        if (response.isValid) {
          const productData = response.data;
          
          // Asegurar que sucursales sea un array de números
          if (productData.sucursales && Array.isArray(productData.sucursales)) {
            // Si sucursales contiene objetos, extraer solo los IDs
            const sucursalesIds = productData.sucursales.map((suc: any) => {
              return typeof suc === 'object' ? suc.suc_id : suc;
            });
            productData.sucursales = sucursalesIds;
          } else {
            productData.sucursales = [];
          }
          
          this.form.patchValue(productData);
          if (productData.prod_img) {
            this.imagePreview.set(productData.image_url);
          }
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
      this.#globalNotification.openToastAlert(
        'Formulario inválido', 
        'Por favor, complete todos los campos requeridos', 
        'danger'
      );
    }
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValues = this.form.value as any;

    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      
      // Saltar campos que son null, undefined o strings vacías (excepto para campos booleanos)
      if (key !== 'prod_img' && value !== null && value !== undefined && value !== '') {
        if (key === 'sucursales' && Array.isArray(value)) {
          // Manejar array de sucursales correctamente
          value.forEach((item: any) => {
            // Asegurar que solo se envíen números, no objetos
            const sucId = typeof item === 'object' ? item.suc_id : item;
            if (sucId && !isNaN(Number(sucId))) {
              formData.append('sucursales[]', sucId.toString());
            }
          });
        } else {
          // Convertir valores a string para evitar problemas de serialización
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value.toString());
          }
        }
      }
    });

    if (this.selectedFile) {
      formData.append('prod_img', this.selectedFile);
    }

    return formData;
  }

  create() {
    const body = this.buildFormData();

    const subscription = this.#productService.create(body).subscribe({
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
    const body = this.buildFormData();
    body.append('_method', 'PUT');

    const subscription = this.#productService
      .create(body) // Sending as POST with _method PUT is safer for file uploads in PHP
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

  async onChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files && input.files.length > 0 ? input.files[0] : null;
    if (!file) return;

    // Validar tipo de archivo
    if (!this.#imageCompressionService.isValidImageFile(file)) {
      this.#globalNotification.openToastAlert(
        'Tipo de archivo no permitido', 
        'Solo se permiten imágenes JPG, PNG o WebP', 
        'danger'
      );
      if (input) input.value = '';
      return;
    }

    const originalSizeKB = file.size / 1024;
    console.log(`📁 Archivo seleccionado: ${file.name} (${originalSizeKB.toFixed(2)} KB)`);

    // Si el archivo ya es menor a 50KB, usarlo directamente
    if (file.size <= 50 * 1024) {
      console.log('✅ Archivo ya está dentro del límite, no necesita compresión');
      this.processValidFile(file);
      return;
    }

    // Mostrar indicador de compresión
    this.isCompressing.set(true);
    this.#globalNotification.openToastAlert(
      'Comprimiendo imagen', 
      `Optimizando imagen de ${originalSizeKB.toFixed(0)} KB...`, 
      'info'
    );

    try {
      // Comprimir imagen
      const result = await this.#imageCompressionService.compressImage(file, 50);

      if (result.success && result.file) {
        const finalSizeKB = result.compressedSize / 1024;
        
        // Si después de la compresión sigue siendo muy grande
        if (result.compressedSize > 50 * 1024) {
          this.#globalNotification.openToastAlert(
            'Imagen demasiado grande', 
            `La imagen no pudo comprimirse a menos de 50KB. Tamaño final: ${finalSizeKB.toFixed(2)} KB. Por favor, selecciona una imagen más pequeña.`, 
            'danger'
          );
          if (input) input.value = '';
          this.isCompressing.set(false);
          return;
        }

        // Éxito en la compresión
        const compressionRatio = ((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1);
        this.#globalNotification.openToastAlert(
          'Imagen optimizada', 
          `Imagen comprimida exitosamente: ${originalSizeKB.toFixed(0)} KB → ${finalSizeKB.toFixed(2)} KB (${compressionRatio}% reducción)`, 
          'success'
        );

        this.processValidFile(result.file);
      } else {
        throw new Error(result.error || 'Error desconocido en la compresión');
      }
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      this.#globalNotification.openToastAlert(
        'Error de compresión', 
        'No se pudo comprimir la imagen. Por favor, intenta con otra imagen.', 
        'danger'
      );
      if (input) input.value = '';
    } finally {
      this.isCompressing.set(false);
    }
  }

  private processValidFile(file: File) {
    this.selectedFile = file;

    // Generar preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.form.patchValue({ prod_img: file });
  }

  removeImage() {
    if (this.isCompressing()) return; // No permitir remover mientras se comprime
    
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.form.patchValue({ prod_img: null });
  }
}
