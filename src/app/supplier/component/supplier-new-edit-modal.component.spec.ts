import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierNewEditModalComponent } from './supplier-new-edit-modal.component';

describe('SupplierNewEditModalComponent', () => {
  let component: SupplierNewEditModalComponent;
  let fixture: ComponentFixture<SupplierNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
