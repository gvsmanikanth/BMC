import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DataFetchService } from './data-fetch.service';

import { DocsService } from './docs.service';
import { StateService } from './state.service';

describe('DocsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [DocsService, DataFetchService, StateService],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: DocsService = TestBed.get(DocsService);
    expect(service).toBeTruthy();
  });
});
