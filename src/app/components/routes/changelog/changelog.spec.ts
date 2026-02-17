import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChangeLogComponent } from "./changelog";

describe("ChangeLog", () => {
  let component: ChangeLogComponent;
  let fixture: ComponentFixture<ChangeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
