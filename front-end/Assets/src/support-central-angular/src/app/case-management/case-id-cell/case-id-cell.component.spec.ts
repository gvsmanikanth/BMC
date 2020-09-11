import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseIdCellComponent } from './case-id-cell.component';

describe('CaseIdCellComponent', () => {
  let component: CaseIdCellComponent;
  let fixture: ComponentFixture<CaseIdCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseIdCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseIdCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
