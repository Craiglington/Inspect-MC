import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldDataComponent } from "./world-data";

describe("WorldDataComponent", () => {
  let component: WorldDataComponent;
  let fixture: ComponentFixture<WorldDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldDataComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
