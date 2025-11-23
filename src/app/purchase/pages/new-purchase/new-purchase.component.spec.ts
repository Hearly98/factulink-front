import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseComponent } from './new-purchase.component';

describe('NewPurchaseComponent', () => {
  let component: NewPurchaseComponent;
  let fixture: ComponentFixture<NewPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
