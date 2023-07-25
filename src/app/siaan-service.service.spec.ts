import { TestBed } from '@angular/core/testing';

import { SiaanServiceService } from './siaan-service.service';

describe('SiaanServiceService', () => {
  let service: SiaanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiaanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
