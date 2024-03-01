import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuisanceDegreeGraphComponent } from './nuisance-degree-graph.component';

describe('NuisanceDegreeGraphComponent', () => {
  let component: NuisanceDegreeGraphComponent;
  let fixture: ComponentFixture<NuisanceDegreeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuisanceDegreeGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuisanceDegreeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
