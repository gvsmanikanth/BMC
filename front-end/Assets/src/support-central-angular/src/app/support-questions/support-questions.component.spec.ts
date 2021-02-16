import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportQuestionsComponent } from './support-questions.component';

describe('SupportQuestionsComponent', () => {
  let component: SupportQuestionsComponent;
  let fixture: ComponentFixture<SupportQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
