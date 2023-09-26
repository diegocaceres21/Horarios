import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesHorariosComponent } from './opciones-horarios.component';

describe('OpcionesHorariosComponent', () => {
  let component: OpcionesHorariosComponent;
  let fixture: ComponentFixture<OpcionesHorariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpcionesHorariosComponent]
    });
    fixture = TestBed.createComponent(OpcionesHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
