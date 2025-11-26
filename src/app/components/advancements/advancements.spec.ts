import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advancements } from './advancements';

describe('Advancements', () => {
  let component: Advancements;
  let fixture: ComponentFixture<Advancements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advancements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Advancements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
