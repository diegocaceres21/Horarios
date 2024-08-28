import { Component } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HorarioMateria} from "../interfaces/horario-materia";
import {Materia} from "../interfaces/materia";
import {NuevaMateriaComponent} from "../modals/nueva-materia/nueva-materia.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-simulador-pagos',
  templateUrl: './simulador-pagos.component.html',
  styleUrls: ['./simulador-pagos.component.scss']
})
export class SimuladorPagosComponent {
  carrera: any;
  displayedColumns = ["sigla", "materia", "uve"]
  dataSource!: MatTableDataSource<Materia>;
  errorAgregar = false;
  materias: Materia[] = []

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  openSnackBar(mensaje: string): void {
    this._snackBar.open(mensaje, 'Aceptar', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 5000
    });
  }
  openDialog(): void {
    try{
      this.errorAgregar = false
      const dialogRef = this.dialog.open(NuevaMateriaComponent, {
        data: {carrera: this.carrera.nombre},
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result)
        if(this.materias.some(x=> x.sigla === result.data.sigla)){
          this.openSnackBar("Esta materia ya está agregada al horario")
        }
        else {
          this.materias.push(result.data);
        }
      });
    }
    catch{
      this.errorAgregar = true
    }
  }

  cambiarTarifarioCarrera(value: any){
    if(value.nombre === "MEDICINA"){
      console.log("Hola")
    }
    else{
      console.log("Hola")
    }
  }
}
