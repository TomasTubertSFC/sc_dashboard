import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersTypologyChartsComponent } from './registers-typology-charts.component';

describe('RegistersTypologyChartsComponent', () => {
  let component: RegistersTypologyChartsComponent;
  let fixture: ComponentFixture<RegistersTypologyChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersTypologyChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersTypologyChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
