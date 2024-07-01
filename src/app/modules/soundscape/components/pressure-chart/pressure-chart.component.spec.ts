import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressureChartComponent } from './pressure-chart.component';

describe('PressureChartComponent', () => {
  let component: PressureChartComponent;
  let fixture: ComponentFixture<PressureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PressureChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PressureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
