import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersChartsComponent } from './registers-charts.component';

describe('RegistersChartsComponent', () => {
  let component: RegistersChartsComponent;
  let fixture: ComponentFixture<RegistersChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
