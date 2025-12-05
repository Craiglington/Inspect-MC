import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordInput } from './coord-input';

describe('CoordInput', () => {
  let component: CoordInput;
  let fixture: ComponentFixture<CoordInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
