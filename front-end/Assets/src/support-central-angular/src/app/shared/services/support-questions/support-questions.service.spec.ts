import { TestBed } from '@angular/core/testing';

import { SupportQuestionsService } from './support-questions.service';

describe('SupportQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportQuestionsService = TestBed.get(SupportQuestionsService);
    expect(service).toBeTruthy();
  });
});
