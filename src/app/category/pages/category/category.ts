import { Component, inject } from '@angular/core';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, RowComponent, TableDirective, ThemeDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CategoryService } from '../../core/services/category';
import { CategoryModel } from '../../core/models/category.model';

@Component({
  selector: 'app-category',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    IconDirective,
    ButtonDirective,
    TableDirective,
],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {
  public title = 'Categorias';
  private categoryService = inject(CategoryService);
  public categories: CategoryModel[] = [];
  ngOnInit(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res;
    });
  }
}
