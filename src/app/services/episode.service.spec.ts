import { TestBed } from '@angular/core/testing';

import { EpisodeService } from './study-zone.service';

describe('EpisodeService', () => {
  let service: EpisodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
