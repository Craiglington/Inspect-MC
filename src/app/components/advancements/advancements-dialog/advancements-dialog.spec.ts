import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdvancementsDialogComponent } from "./advancements-dialog";

describe("AdvancementsDialogComponent", () => {
  let component: AdvancementsDialogComponent;
  let fixture: ComponentFixture<AdvancementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancementsDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
