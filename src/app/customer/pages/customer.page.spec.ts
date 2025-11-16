import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPage } from './customer.page';

describe('CustomerComponent', () => {
  let component: CustomerPage;
  let fixture: ComponentFixture<CustomerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
