import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventsPageComponent } from './my-events-page.component';

describe('MyEventsPageComponent', () => {
  let component: MyEventsPageComponent;
  let fixture: ComponentFixture<MyEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEventsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
