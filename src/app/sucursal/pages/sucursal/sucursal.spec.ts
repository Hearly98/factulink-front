import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sucursal } from './sucursal';

describe('Sucursal', () => {
  let component: Sucursal;
  let fixture: ComponentFixture<Sucursal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sucursal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sucursal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
