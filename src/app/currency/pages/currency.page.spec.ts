import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPage } from './currency.page';

describe('CurrencyPage', () => {
  let component: CurrencyPage;
  let fixture: ComponentFixture<CurrencyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
