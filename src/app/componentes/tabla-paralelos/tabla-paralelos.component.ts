import {Component, forwardRef, Input} from '@angular/core';
import {HorarioMateria} from "../../interfaces/horario-materia";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Table} from "jspdf-autotable";
import {MatTableDataSource} from "@angular/material/table";
import {Horario} from "../../interfaces/horario";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TablaParalelosComponent),
      multi: true
    }
  ],
  selector: 'app-tabla-paralelos',
  templateUrl: './tabla-paralelos.component.html',
  styleUrls: ['./tabla-paralelos.component.scss']
})
export class TablaParalelosComponent implements ControlValueAccessor{
  @Input() set paralelos(val: HorarioMateria[]) {
    this._paralelos = val;
    this.dataSource.data = this._paralelos;
  }
  
  @Input() set horarios(val: HorarioMateria[]) {
    this._horarios = val;
    this.dataSource.data = this._horarios;
    this.propagateChange(this._horarios);
  }

  _paralelos: HorarioMateria[] = [];
  _horarios: HorarioMateria[] = [];

  displayedColumns: string[] = ['sigla', 'materia', "docente", 'paralelo', "cupos", "horario"];
  dataSource = new MatTableDataSource<HorarioMateria>();

  ngOnInit() {
    this.dataSource.data = this._paralelos;
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.horarios = value;
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
