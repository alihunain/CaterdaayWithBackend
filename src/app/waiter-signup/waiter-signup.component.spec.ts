import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterSignupComponent } from './waiter-signup.component';

describe('WaiterSignupComponent', () => {
  let component: WaiterSignupComponent;
  let fixture: ComponentFixture<WaiterSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
