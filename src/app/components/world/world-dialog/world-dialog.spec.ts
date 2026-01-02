import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldDialogComponent } from "./world-dialog";

describe("WorldDialogComponent", () => {
  let component: WorldDialogComponent;
  let fixture: ComponentFixture<WorldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
