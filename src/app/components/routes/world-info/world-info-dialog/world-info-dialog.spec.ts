import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldInfoDialogComponent } from "./world-info-dialog";

describe("WorldInfoDialogComponent", () => {
  let component: WorldInfoDialogComponent;
  let fixture: ComponentFixture<WorldInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldInfoDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
