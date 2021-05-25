import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCompatibilityComponent } from './product-compatibility.component';

describe('ProductCompatibilityComponent', () => {
  let component: ProductCompatibilityComponent;
  let fixture: ComponentFixture<ProductCompatibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCompatibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
