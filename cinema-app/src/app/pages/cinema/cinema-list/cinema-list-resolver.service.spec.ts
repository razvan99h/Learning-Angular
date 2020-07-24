import { TestBed } from '@angular/core/testing';

import { CinemaListResolverService } from './cinema-list-resolver.service';

describe('CinemaListResolverService', () => {
  let service: CinemaListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CinemaListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
