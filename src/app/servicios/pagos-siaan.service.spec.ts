import { TestBed } from '@angular/core/testing';

import { PagosSiaanService } from './pagos-siaan.service';

describe('PagosSiaanService', () => {
  let service: PagosSiaanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagosSiaanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
