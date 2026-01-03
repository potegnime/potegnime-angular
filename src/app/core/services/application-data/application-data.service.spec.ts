import { TestBed } from '@angular/core/testing';

import { ApplicationDataService } from './application-data.service';

describe('ApplicationDataService', () => {
  let service: ApplicationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
