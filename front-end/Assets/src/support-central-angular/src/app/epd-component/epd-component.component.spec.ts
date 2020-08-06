import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpdComponentComponent } from './epd-component.component';

describe('EpdComponentComponent', () => {
  let component: EpdComponentComponent;
  let fixture: ComponentFixture<EpdComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpdComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpdComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
