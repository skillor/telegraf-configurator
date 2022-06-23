import { TestBed } from '@angular/core/testing';

import { BuildApiService } from './build-api.service';

describe('BuildApiService', () => {
  let service: BuildApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
