import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityProductComponent } from './community-product.component';

describe('CommunityProductComponent', () => {
  let component: CommunityProductComponent;
  let fixture: ComponentFixture<CommunityProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
