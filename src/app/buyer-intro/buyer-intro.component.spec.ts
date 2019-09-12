import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerIntroComponent } from './buyer-intro.component';

describe('BuyerIntroComponent', () => {
  let component: BuyerIntroComponent;
  let fixture: ComponentFixture<BuyerIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
