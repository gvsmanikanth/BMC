import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsProductComponent } from './docs-product.component';

describe('DocsProductComponent', () => {
  let component: DocsProductComponent;
  let fixture: ComponentFixture<DocsProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
