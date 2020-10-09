import { TestBed } from '@angular/core/testing';

import { PanzoomService } from './panzoom.service';

describe('PanzoomService', () => {
  let service: PanzoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanzoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
