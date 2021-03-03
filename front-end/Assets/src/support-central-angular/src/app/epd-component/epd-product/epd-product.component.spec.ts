import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpdProductComponent } from './epd-product.component';

describe('EpdProductComponent', () => {
  let component: EpdProductComponent;
  let fixture: ComponentFixture<EpdProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpdProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpdProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
