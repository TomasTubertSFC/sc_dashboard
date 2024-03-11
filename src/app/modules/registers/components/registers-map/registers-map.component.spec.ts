import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersMapComponent } from './registers-map.component';

describe('RegistersMapComponent', () => {
  let component: RegistersMapComponent;
  let fixture: ComponentFixture<RegistersMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
