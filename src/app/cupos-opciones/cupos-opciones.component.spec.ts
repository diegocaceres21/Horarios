import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuposOpcionesComponent } from './cupos-opciones.component';

describe('CuposOpcionesComponent', () => {
  let component: CuposOpcionesComponent;
  let fixture: ComponentFixture<CuposOpcionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuposOpcionesComponent]
    });
    fixture = TestBed.createComponent(CuposOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
