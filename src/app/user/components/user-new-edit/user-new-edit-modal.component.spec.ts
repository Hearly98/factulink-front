import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewEditModalComponent } from './user-new-edit-modal.component';

describe('UserNewEditModalComponent', () => {
  let component: UserNewEditModalComponent;
  let fixture: ComponentFixture<UserNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
