import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorPagosComponent } from './simulador-pagos.component';

describe('SimuladorPagosComponent', () => {
  let component: SimuladorPagosComponent;
  let fixture: ComponentFixture<SimuladorPagosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimuladorPagosComponent]
    });
    fixture = TestBed.createComponent(SimuladorPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
