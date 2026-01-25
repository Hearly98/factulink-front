import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolNewEditModal } from './rol-new-edit-modal';

describe('RolNewEditModal', () => {
  let component: RolNewEditModal;
  let fixture: ComponentFixture<RolNewEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolNewEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolNewEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
