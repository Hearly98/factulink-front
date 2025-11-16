import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyNewEditModalComponent } from './currency-new-edit-modal.component';

describe('CurrencyNewEditModalComponent', () => {
  let component: CurrencyNewEditModalComponent;
  let fixture: ComponentFixture<CurrencyNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
