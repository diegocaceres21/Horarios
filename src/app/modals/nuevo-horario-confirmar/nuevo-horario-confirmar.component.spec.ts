import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoHorarioConfirmarComponent } from './nuevo-horario-confirmar.component';

describe('NuevoHorarioConfirmarComponent', () => {
  let component: NuevoHorarioConfirmarComponent;
  let fixture: ComponentFixture<NuevoHorarioConfirmarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoHorarioConfirmarComponent]
    });
    fixture = TestBed.createComponent(NuevoHorarioConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
