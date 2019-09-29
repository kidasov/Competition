import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAllNotificationsButtonComponent } from './remove-all-notifications-button.component';

describe('RemoveAllNotificationsButtonComponent', () => {
  let component: RemoveAllNotificationsButtonComponent;
  let fixture: ComponentFixture<RemoveAllNotificationsButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAllNotificationsButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAllNotificationsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
