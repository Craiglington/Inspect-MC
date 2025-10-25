import { TestBed } from '@angular/core/testing';

import { DecompressionService } from './decompression-service';

describe('DecompressionService', () => {
  let service: DecompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecompressionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
