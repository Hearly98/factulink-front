import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalNewEditModal } from './sucursal-new-edit-modal';

describe('SucursalNewEditModal', () => {
  let component: SucursalNewEditModal;
  let fixture: ComponentFixture<SucursalNewEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalNewEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalNewEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
