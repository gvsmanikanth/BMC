import { TestBed } from '@angular/core/testing';

import { CaseManageService } from './case-manage.service';

describe('CaseManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseManageService = TestBed.get(CaseManageService);
    expect(service).toBeTruthy();
  });
});
