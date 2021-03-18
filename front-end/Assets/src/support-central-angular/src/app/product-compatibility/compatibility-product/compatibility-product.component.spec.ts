import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilityProductComponent } from './compatibility-product.component';

describe('CompatibilityProductComponent', () => {
  let component: CompatibilityProductComponent;
  let fixture: ComponentFixture<CompatibilityProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatibilityProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilityProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
