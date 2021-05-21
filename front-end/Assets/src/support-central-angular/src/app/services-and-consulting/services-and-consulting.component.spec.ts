import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StateService } from '../shared/services/state.service';

import { ServicesAndConsultingComponent } from './services-and-consulting.component';

describe('ServicesAndConsultingComponent', () => {
  let component: ServicesAndConsultingComponent;
  let fixture: ComponentFixture<ServicesAndConsultingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesAndConsultingComponent ],
      providers: [ StateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesAndConsultingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
