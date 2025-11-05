import { TestBed } from '@angular/core/testing';

import { AsapiInterceptor } from './api.interceptor';

describe('AsapiInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AsapiInterceptor]
    })
  );

  it('should be created', () => {
    const interceptor: AsapiInterceptor = TestBed.inject(AsapiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
