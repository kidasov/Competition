import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsTableComponent } from './user-events-table.component';

describe('UserEventsTableComponent', () => {
  let component: UserEventsTableComponent;
  let fixture: ComponentFixture<UserEventsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEventsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
