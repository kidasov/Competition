import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordFormComponent } from './recover-password-form.component';

describe('RecoverPasswordFormComponent', () => {
  let component: RecoverPasswordFormComponent;
  let fixture: ComponentFixture<RecoverPasswordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverPasswordFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
