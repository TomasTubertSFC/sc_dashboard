import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesMapConeComponent } from './episodes-map-cone.component';

describe('EpisodesMapConeComponent', () => {
  let component: EpisodesMapConeComponent;
  let fixture: ComponentFixture<EpisodesMapConeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesMapConeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodesMapConeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
