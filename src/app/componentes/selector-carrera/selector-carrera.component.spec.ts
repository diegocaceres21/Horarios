import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorCarreraComponent } from './selector-carrera.component';

describe('SelectorCarreraComponent', () => {
  let component: SelectorCarreraComponent;
  let fixture: ComponentFixture<SelectorCarreraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorCarreraComponent]
    });
    fixture = TestBed.createComponent(SelectorCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
