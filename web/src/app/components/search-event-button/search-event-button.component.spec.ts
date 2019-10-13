import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEventButtonComponent } from './search-event-button.component';

describe('SearchEventButtonComponent', () => {
  let component: SearchEventButtonComponent;
  let fixture: ComponentFixture<SearchEventButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEventButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEventButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
