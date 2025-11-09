import { TestBed } from '@angular/core/testing';

import { AnvilService } from './anvil-service';

describe('AnvilService', () => {
  let service: AnvilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnvilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
