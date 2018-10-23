import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthVkComponent } from './auth-vk.component';

describe('AuthVkComponent', () => {
  let component: AuthVkComponent;
  let fixture: ComponentFixture<AuthVkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthVkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthVkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
