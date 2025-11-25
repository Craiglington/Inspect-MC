import { TestBed } from '@angular/core/testing';

import { MojangService } from './mojang-service';

describe('MojangService', () => {
  let service: MojangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MojangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
