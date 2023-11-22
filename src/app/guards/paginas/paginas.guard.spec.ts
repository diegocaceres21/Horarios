import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { paginasGuard } from './paginas.guard';

describe('paginasGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => paginasGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
