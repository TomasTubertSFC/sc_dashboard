import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesModalComponent } from './episodes-modal.component';

describe('EpisodesModalComponent', () => {
  let component: EpisodesModalComponent;
  let fixture: ComponentFixture<EpisodesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
