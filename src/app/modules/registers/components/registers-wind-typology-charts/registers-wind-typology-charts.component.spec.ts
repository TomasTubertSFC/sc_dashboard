import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersWindTypologyChartsComponent } from './registers-wind-typology-charts.component';

describe('RegistersWindTypologyChartsComponent', () => {
  let component: RegistersWindTypologyChartsComponent;
  let fixture: ComponentFixture<RegistersWindTypologyChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersWindTypologyChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersWindTypologyChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
