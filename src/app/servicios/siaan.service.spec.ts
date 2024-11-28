import { TestBed } from '@angular/core/testing';

import { SiaanService } from './siaan.service';

describe('SiaanService', () => {
  let service: SiaanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiaanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
