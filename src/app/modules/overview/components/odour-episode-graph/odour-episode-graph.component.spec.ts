import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdourEpisodeGraphComponent } from './odour-episode-graph.component';

describe('OdourEpisodeGraphComponent', () => {
  let component: OdourEpisodeGraphComponent;
  let fixture: ComponentFixture<OdourEpisodeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OdourEpisodeGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OdourEpisodeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
