import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateSelectcombo } from './state-selectcombo';

describe('StateSelectcombo', () => {
  let component: StateSelectcombo;
  let fixture: ComponentFixture<StateSelectcombo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateSelectcombo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateSelectcombo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
