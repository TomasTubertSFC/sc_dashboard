import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersPageComponent } from './registers-page.component';

describe('RegistersPageComponent', () => {
  let component: RegistersPageComponent;
  let fixture: ComponentFixture<RegistersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
