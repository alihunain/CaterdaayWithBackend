import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResturantCountComponent } from './resturant-count.component';

describe('ResturantCountComponent', () => {
  let component: ResturantCountComponent;
  let fixture: ComponentFixture<ResturantCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResturantCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResturantCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
