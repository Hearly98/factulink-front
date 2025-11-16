import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationNewEditModalComponent } from './organization-new-edit-modal.component';

describe('OrganizationNewEditModalComponent', () => {
  let component: OrganizationNewEditModalComponent;
  let fixture: ComponentFixture<OrganizationNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
