import { TestBed } from '@angular/core/testing';

import { OfertaSiaanService } from './oferta-siaan.service';

describe('OfertaSiaanService', () => {
  let service: OfertaSiaanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaSiaanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
