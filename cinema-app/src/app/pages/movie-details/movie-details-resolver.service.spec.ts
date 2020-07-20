import { TestBed } from '@angular/core/testing';

import { MovieDetailsResolverService } from './movie-details-resolver.service';

describe('MovieDetailsResolverService', () => {
  let service: MovieDetailsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDetailsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
