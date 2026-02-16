import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerDataDialogComponent } from "./player-data-dialog";

describe("PlayerDataDialogComponent", () => {
  let component: PlayerDataDialogComponent;
  let fixture: ComponentFixture<PlayerDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDataDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
