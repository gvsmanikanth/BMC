import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DataFetchService } from '../data-fetch.service';
import { StateService } from '../state.service';

import { CommunityService } from './community.service';

describe('CommunityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CommunityService, DataFetchService, StateService],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: CommunityService = TestBed.get(CommunityService);
    expect(service).toBeTruthy();
  });
});
