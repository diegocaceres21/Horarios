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
  @Input() _horarios! :HorarioMateria[];

  displayedColumns: string[] = ['sigla', 'materia', "docente", 'paralelo', "cupos", "horario"];
  dataSource!: MatTableDataSource<HorarioMateria>;
  writeValue(value: any) {
    if (value !== undefined) {
      this.horarios = value;
      this.dataSource = new MatTableDataSource(this.horarios);
    }
  }
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  get horarios() {
    return this._horarios;
  }

  set horarios(val) {
    this._horarios = val;
    this.propagateChange(this._horarios);
  }
}
