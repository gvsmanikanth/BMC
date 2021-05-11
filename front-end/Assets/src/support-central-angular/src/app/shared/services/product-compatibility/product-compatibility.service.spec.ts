import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DataFetchService } from '../data-fetch.service';
import { StateService } from '../state.service';

import { ProductCompatibilityService } from './product-compatibility.service';

describe('ProductCompatibilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ProductCompatibilityService, DataFetchService, StateService],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: ProductCompatibilityService = TestBed.get(ProductCompatibilityService);
    expect(service).toBeTruthy();
  });
});
