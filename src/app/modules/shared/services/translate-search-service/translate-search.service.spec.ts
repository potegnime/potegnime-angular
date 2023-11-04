import { TestBed } from '@angular/core/testing';

import { TranslateSearchService } from './translate-search.service';

describe('TranslateSearchService', () => {
  let service: TranslateSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
