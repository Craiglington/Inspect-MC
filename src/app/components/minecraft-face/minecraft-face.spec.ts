import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MinecraftFace } from "./minecraft-face";

describe("MinecraftFace", () => {
  let component: MinecraftFace;
  let fixture: ComponentFixture<MinecraftFace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinecraftFace]
    }).compileComponents();

    fixture = TestBed.createComponent(MinecraftFace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
