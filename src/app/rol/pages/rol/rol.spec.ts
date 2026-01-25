import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rol } from './rol';

describe('Rol', () => {
  let component: Rol;
  let fixture: ComponentFixture<Rol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
