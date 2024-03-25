import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersTimeChartsComponent } from './registers-time-charts.component';

describe('RegistersChartsComponent', () => {
  let component: RegistersTimeChartsComponent;
  let fixture: ComponentFixture<RegistersTimeChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersTimeChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistersTimeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
