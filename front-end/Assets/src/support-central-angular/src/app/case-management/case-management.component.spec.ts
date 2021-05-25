import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdaptBusyModule, AdaptEmptyStateModule, AdaptPaginationModule } from '@bmc-ux/adapt-angular';
import { CaseManageService } from '../shared/services/case-manage.service';
import { DataFetchService } from '../shared/services/data-fetch.service';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { StateService } from '../shared/services/state.service';

import { CaseManagementComponent } from './case-management.component';

describe('CaseManagementComponent', () => {
  let component: CaseManagementComponent;
  let fixture: ComponentFixture<CaseManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseManagementComponent ],
      imports: [
        AdaptPaginationModule,
        AdaptBusyModule,
        AdaptEmptyStateModule,
        HttpClientModule
      ],
      providers: [
        StateService,
        CaseManageService,
        GoogleAnalyticsService,
        DataFetchService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
