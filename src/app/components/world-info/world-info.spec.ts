import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldInfoComponent } from "./world-info";

describe("WorldInfoComponent", () => {
  let component: WorldInfoComponent;
  let fixture: ComponentFixture<WorldInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
