import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodNewEditModalComponent } from './payment-method-new-edit-modal.component';

describe('PaymentMethodNewEditModalComponent', () => {
  let component: PaymentMethodNewEditModalComponent;
  let fixture: ComponentFixture<PaymentMethodNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
