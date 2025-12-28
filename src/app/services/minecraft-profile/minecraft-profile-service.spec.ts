import { TestBed } from "@angular/core/testing";
import { MinecraftProfileService } from "./minecraft-profile-service";

describe("MinecraftProfileService", () => {
  let service: MinecraftProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinecraftProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
