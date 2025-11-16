import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPage } from './company.page';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
