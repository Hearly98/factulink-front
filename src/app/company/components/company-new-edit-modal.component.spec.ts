import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNewEditModalComponent } from './company-new-edit-modal.component';

describe('CompanyNewEditModalComponent', () => {
  let component: CompanyNewEditModalComponent;
  let fixture: ComponentFixture<CompanyNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
