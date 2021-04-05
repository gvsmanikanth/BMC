import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { compatibility } from 'src/app/shared/data/compatibility';
import { EPDVersionPipe } from 'src/app/shared/pipes/version.pipe';

import { CompatibilityProductComponent } from './compatibility-product.component';

describe('CompatibilityProductComponent', () => {
  let component: CompatibilityProductComponent;
  let fixture: ComponentFixture<CompatibilityProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CompatibilityProductComponent,
        EPDVersionPipe
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilityProductComponent);
    component = fixture.componentInstance;
    component.product = compatibility[1];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
