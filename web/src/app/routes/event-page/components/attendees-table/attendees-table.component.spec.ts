import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesTableComponent } from './attendees-table.component';

describe('AttendeesTableComponent', () => {
  let component: AttendeesTableComponent;
  let fixture: ComponentFixture<AttendeesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
