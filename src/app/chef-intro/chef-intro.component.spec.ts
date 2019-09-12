import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefIntroComponent } from './chef-intro.component';

describe('ChefIntroComponent', () => {
  let component: ChefIntroComponent;
  let fixture: ComponentFixture<ChefIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChefIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
