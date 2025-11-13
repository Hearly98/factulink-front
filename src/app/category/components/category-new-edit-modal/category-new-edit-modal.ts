import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { CategoryService } from '../../core/services/category.service';
import { IconDirective } from '@coreui/icons-angular';
import { buildCategoryForm, categoryStructure } from '../../helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { CategoryForm } from '../../core/types/cat-form';
import { BaseComponent } from '../../../shared/base/base.component';
import { MODULES } from '../../../core/config/permissions/modules';

@Component({
  selector: 'app-category-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalBodyComponent,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './category-new-edit-modal.html',
  styleUrl: './category-new-edit-modal.scss',
})
export class CategoryNewEditModal extends BaseComponent implements OnInit {
  form!: TypedFormGroup<CategoryForm>;
  visible = false;
  structure = categoryStructure;
  #categoryService = inject(CategoryService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Categoria';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CATEGORY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildCategoryForm());
  }

  openModal(idCategory?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    if (idCategory) {
      this.loadData(idCategory);
    }
  }

  loadData(idCategory: number) {
    this.#categoryService.getById(idCategory).subscribe({
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
}
