import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurePage } from './unit-of-measure.component';

describe('UnitOfMeasurePage', () => {
  let component: UnitOfMeasurePage;
  let fixture: ComponentFixture<UnitOfMeasurePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitOfMeasurePage],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitOfMeasurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
