import { TestBed } from '@angular/core/testing';

import { ProductCompatibilityService } from './product-compatibility.service';

describe('ProductCompatibilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductCompatibilityService = TestBed.get(ProductCompatibilityService);
    expect(service).toBeTruthy();
  });
});
