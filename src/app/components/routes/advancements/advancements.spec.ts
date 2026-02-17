import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdvancementsComponent } from "./advancements";

describe("AdvancementsComponent", () => {
  let component: AdvancementsComponent;
  let fixture: ComponentFixture<AdvancementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancementsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
