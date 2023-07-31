import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaMateriaComponent } from './nueva-materia.component';

describe('NuevaMateriaComponent', () => {
  let component: NuevaMateriaComponent;
  let fixture: ComponentFixture<NuevaMateriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaMateriaComponent]
    });
    fixture = TestBed.createComponent(NuevaMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
