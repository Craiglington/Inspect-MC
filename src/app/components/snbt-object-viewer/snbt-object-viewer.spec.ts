import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SnbtObjectViewerComponent } from "./snbt-object-viewer";

describe("SnbtObjectViewerComponent", () => {
  let component: SnbtObjectViewerComponent;
  let fixture: ComponentFixture<SnbtObjectViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnbtObjectViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SnbtObjectViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
