import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeNewEditModalComponent } from './document-type-new-edit-modal.component';

describe('DocumentTypeNewEditModalComponent', () => {
  let component: DocumentTypeNewEditModalComponent;
  let fixture: ComponentFixture<DocumentTypeNewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeNewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeNewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
