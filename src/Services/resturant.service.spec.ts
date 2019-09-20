import { TestBed } from '@angular/core/testing';

import { ResturantService } from './resturant.service';

describe('ResturantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResturantService = TestBed.get(ResturantService);
    expect(service).toBeTruthy();
  });
});
