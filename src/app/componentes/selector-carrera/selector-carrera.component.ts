import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorCarreraComponent),
      multi: true
    }
  ],
  selector: 'app-selector-carrera',
  templateUrl: './selector-carrera.component.html',
  styleUrls: ['./selector-carrera.component.scss']
})
export class SelectorCarreraComponent implements ControlValueAccessor{
  @Input() _carrera = '';
  @Input() opcionTodosHabilitado : boolean = false;

  writeValue(value: any) {
    if (value !== undefined) {
      this.carrera = value;
    }
  }
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  carrerasPorDepartamento : any[] =  [
    {departamento: "CIENCIAS DE LA SALUD", carreras: [
        {nombre: 'MEDICINA'},
        {nombre: 'ODONTOLOGÍA'},
      ]},
    {departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS'},
        {nombre: 'CONTADURÍA PÚBLICA'},
        {nombre: 'INGENIERÍA COMERCIAL'},
        {nombre: "INGENIERÍA EN COMERCIO Y FINANZAS INTERNACIONALES"},
        {nombre: 'INGENIERÍA EMPRESARIAL'},
        {nombre: 'INGENIERÍA FINANCIERA'},
        {nombre: 'TÉCNICO SUPERIOR EN CONTADURÍA GENERAL'}
      ]},
    {departamento: "DCEI", carreras: [
        {nombre: 'ARQUITECTURA'},
        {nombre: 'INGENIERÍA AMBIENTAL'},
        {nombre: 'INGENIERÍA CIVIL',},
        {nombre: 'INGENIERÍA INDUSTRIAL'},
        {nombre: 'INGENIERÍA MECATRÓNICA'},
        {nombre: 'INGENIERÍA QUÍMICA'},
        {nombre: 'INGENIERÍA DE SISTEMAS'},
        {nombre: 'INGENIERÍA EN TELECOMUNICACIONES'}
      ]},
    {departamento: "DCSH", carreras: [
        {nombre: 'ANTROPOLOGÍA'},
        {nombre: 'COMUNICACIÓN SOCIAL'},
        {nombre: 'DERECHO'},
        {nombre: 'DISEÑO DIGITAL MULTIMEDIA'},
        {nombre: 'FILOSOFÍA Y LETRAS'},
        {nombre: 'PSICOLOGÍA'},
        {nombre: 'TÉCNICO SUPERIOR EN COMUNICACIÓN MULTIMEDIA'}
      ]}
  ]


  get carrera() {
    return this._carrera;
  }

  set carrera(val) {
    this._carrera = val;
    this.propagateChange(this._carrera);
  }


}
