import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCitizenshipGraphComponent } from './participant-citizenship-graph.component';

describe('ParticipantCitizenshipGraphComponent', () => {
  let component: ParticipantCitizenshipGraphComponent;
  let fixture: ComponentFixture<ParticipantCitizenshipGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipantCitizenshipGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantCitizenshipGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
