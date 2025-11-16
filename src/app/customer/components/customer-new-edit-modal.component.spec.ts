import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNewEditModalComponent } from './customer-new-edit-modal.component';

describe('CustomerNewEditModalComponent', () => {
  let component: CustomerNewEditModalComponent;
  let fixture: ComponentFixture<CustomerNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
