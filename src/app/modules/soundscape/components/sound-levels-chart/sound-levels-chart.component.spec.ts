import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundLevelsChartComponent } from './sound-levels-chart.component';

describe('SoundLevelsChartComponent', () => {
  let component: SoundLevelsChartComponent;
  let fixture: ComponentFixture<SoundLevelsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoundLevelsChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoundLevelsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
