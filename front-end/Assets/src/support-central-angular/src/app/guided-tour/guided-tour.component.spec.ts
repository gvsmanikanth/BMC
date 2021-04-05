import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StateService } from '../shared/services/state.service';
import * as environment from '../../environments/environment';

import { GuidedTourComponent } from './guided-tour.component';

describe('GuidedTourComponent', () => {
  let component: GuidedTourComponent;
  let fixture: ComponentFixture<GuidedTourComponent>;
  let environment2 = environment.environment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidedTourComponent ],
      providers: [ StateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use introJS on init', () => {
    expect(component.intro).toBeTruthy();
  })
});
