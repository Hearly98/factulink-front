import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [RowComponent, ColComponent, NgbPagination],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
