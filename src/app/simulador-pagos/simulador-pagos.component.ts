import { Component } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HorarioMateria} from "../interfaces/horario-materia";
import {Materia} from "../interfaces/materia";

@Component({
  selector: 'app-simulador-pagos',
  templateUrl: './simulador-pagos.component.html',
  styleUrls: ['./simulador-pagos.component.scss']
})
export class SimuladorPagosComponent {
  carrera: any;
  displayedColumns = ["sigla", "materia", "uve"]
  dataSource!: MatTableDataSource<Materia>;
}
