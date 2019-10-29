import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyNPolicyComponent } from './privacy-n-policy.component';

describe('PrivacyNPolicyComponent', () => {
  let component: PrivacyNPolicyComponent;
  let fixture: ComponentFixture<PrivacyNPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyNPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyNPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
