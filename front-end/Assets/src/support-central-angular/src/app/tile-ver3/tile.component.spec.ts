import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileVer3Component } from './tile.component';

describe('TileComponent', () => {
  let component: TileVer3Component;
  let fixture: ComponentFixture<TileVer3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileVer3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileVer3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
