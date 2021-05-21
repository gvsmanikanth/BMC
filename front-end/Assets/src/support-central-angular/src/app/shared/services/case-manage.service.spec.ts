import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CaseManageService } from './case-manage.service';
import { DataFetchService } from './data-fetch.service';
import { StateService } from './state.service';

describe('CaseManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CaseManageService, DataFetchService, StateService],
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: CaseManageService = TestBed.get(CaseManageService);
    expect(service).toBeTruthy();
  });
});
