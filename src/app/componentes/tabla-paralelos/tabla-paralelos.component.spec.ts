import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaParalelosComponent } from './tabla-paralelos.component';

describe('TablaParalelosComponent', () => {
  let component: TablaParalelosComponent;
  let fixture: ComponentFixture<TablaParalelosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaParalelosComponent]
    });
    fixture = TestBed.createComponent(TablaParalelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
