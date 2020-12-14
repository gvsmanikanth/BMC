import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileVer2Component } from './tile.component';

describe('TileComponent', () => {
  let component: TileVer2Component;
  let fixture: ComponentFixture<TileVer2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileVer2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileVer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
