import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNewEditModal } from './category-new-edit-modal';

describe('CategoryNewEditModal', () => {
  let component: CategoryNewEditModal;
  let fixture: ComponentFixture<CategoryNewEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryNewEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryNewEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
