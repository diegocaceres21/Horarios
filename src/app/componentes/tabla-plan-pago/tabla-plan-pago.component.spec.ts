import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPlanPagoComponent } from './tabla-plan-pago.component';

describe('TablaPlanPagoComponent', () => {
  let component: TablaPlanPagoComponent;
  let fixture: ComponentFixture<TablaPlanPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaPlanPagoComponent]
    });
    fixture = TestBed.createComponent(TablaPlanPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
