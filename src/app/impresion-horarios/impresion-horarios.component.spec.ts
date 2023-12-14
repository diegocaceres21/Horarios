import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresionHorariosComponent } from './impresion-horarios.component';

describe('ImpresionHorariosComponent', () => {
  let component: ImpresionHorariosComponent;
  let fixture: ComponentFixture<ImpresionHorariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImpresionHorariosComponent]
    });
    fixture = TestBed.createComponent(ImpresionHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
