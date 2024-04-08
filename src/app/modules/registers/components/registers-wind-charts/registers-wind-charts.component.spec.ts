import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersWindChartsComponent } from './registers-wind-charts.component';

describe('RegistersWindChartsComponent', () => {
  let component: RegistersWindChartsComponent;
  let fixture: ComponentFixture<RegistersWindChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersWindChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersWindChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
