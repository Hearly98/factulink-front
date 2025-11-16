import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNewEditModalComponent } from './document-new-edit-modal.component';

describe('DocumentNewEditModalComponent', () => {
  let component: DocumentNewEditModalComponent;
  let fixture: ComponentFixture<DocumentNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
