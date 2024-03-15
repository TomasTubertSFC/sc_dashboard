import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersFilterModalComponent } from './registers-filter-modal.component';

describe('RegistersFilterModalComponent', () => {
  let component: RegistersFilterModalComponent;
  let fixture: ComponentFixture<RegistersFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersFilterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
