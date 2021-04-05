import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DataFetchService } from '../data-fetch.service';
import { StateService } from '../state.service';

import { SupportQuestionsService } from './support-questions.service';

describe('SupportQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SupportQuestionsService, DataFetchService, StateService],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: SupportQuestionsService = TestBed.get(SupportQuestionsService);
    expect(service).toBeTruthy();
  });
});
