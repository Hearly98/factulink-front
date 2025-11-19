import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeComponent } from './document-type.component';

describe('DocumentTypeComponent', () => {
  let component: DocumentTypeComponent;
  let fixture: ComponentFixture<DocumentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
