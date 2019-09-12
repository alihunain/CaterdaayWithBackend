import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerCateringSearchComponent } from './inner-catering-search.component';

describe('InnerCateringSearchComponent', () => {
  let component: InnerCateringSearchComponent;
  let fixture: ComponentFixture<InnerCateringSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerCateringSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerCateringSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
