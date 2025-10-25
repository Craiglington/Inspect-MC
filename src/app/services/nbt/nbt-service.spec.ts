import { TestBed } from "@angular/core/testing";

import { NBTService } from "./nbt-service";

describe("Dat", () => {
  let service: NBTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NBTService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
