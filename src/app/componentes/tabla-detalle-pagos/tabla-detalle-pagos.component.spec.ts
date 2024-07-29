import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDetallePagosComponent } from './tabla-detalle-pagos.component';

describe('TablaDetallePagosComponent', () => {
  let component: TablaDetallePagosComponent;
  let fixture: ComponentFixture<TablaDetallePagosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaDetallePagosComponent]
    });
    fixture = TestBed.createComponent(TablaDetallePagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
