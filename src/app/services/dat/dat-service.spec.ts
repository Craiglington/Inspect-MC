import { TestBed } from "@angular/core/testing";

import { DatService } from "./dat-service";

describe("DatService", () => {
  let service: DatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
