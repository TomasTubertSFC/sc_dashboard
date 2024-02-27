import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesTimelineComponent } from './episodes-timeline.component';

describe('EpisodesTimelineComponent', () => {
  let component: EpisodesTimelineComponent;
  let fixture: ComponentFixture<EpisodesTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodesTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
