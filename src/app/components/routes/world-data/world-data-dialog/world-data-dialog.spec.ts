import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldDataDialogComponent } from "./world-data-dialog";

describe("WorldDataDialogComponent", () => {
  let component: WorldDataDialogComponent;
  let fixture: ComponentFixture<WorldDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldDataDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
