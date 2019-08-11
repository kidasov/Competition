import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserButtonComponent } from './edit-user-button.component';

describe('EditUserButtonComponent', () => {
  let component: EditUserButtonComponent;
  let fixture: ComponentFixture<EditUserButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
