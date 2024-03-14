import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyZoneSelectModalComponent } from './study-zone-select-modal.component';

describe('StudyZoneSelectModalComponent', () => {
  let component: StudyZoneSelectModalComponent;
  let fixture: ComponentFixture<StudyZoneSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyZoneSelectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudyZoneSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
