import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeTableComponent } from './attendee-table.component';

describe('AttendeeTableComponent', () => {
  let component: AttendeeTableComponent;
  let fixture: ComponentFixture<AttendeeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
