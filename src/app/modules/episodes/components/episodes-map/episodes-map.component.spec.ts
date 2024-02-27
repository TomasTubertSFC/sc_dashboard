import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesMapComponent } from './episodes-map.component';

describe('EpisodesMapComponent', () => {
  let component: EpisodesMapComponent;
  let fixture: ComponentFixture<EpisodesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
