import { TestBed } from '@angular/core/testing';

import { RecommendService } from './recommend.service';

describe('RecommendService', () => {
  let service: RecommendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
