import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { Materia } from 'src/app/interfaces/materia';
import { PlanesService } from 'src/app/servicios/planes.service';

@Component({
  selector: 'app-nueva-materia',
  templateUrl: './nueva-materia.component.html',
  styleUrls: ['./nueva-materia.component.scss']
})
export class NuevaMateriaComponent implements OnInit{
  materia?: Materia;
  carrera : string = "";
  materiasFiltro!: Observable<Materia[]>;
  materias: Materia[]= []
  objectControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<NuevaMateriaComponent>, private planesServicio: PlanesService){

  }

  async ngOnInit() {
   this.getMaterias()
     //Agregar carrera
    this.materiasFiltro = this.objectControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterObjects(value))
    );
    
  }

  getMaterias(){
    this.planesServicio.getDatos().subscribe(
      (data) => {this.materias = data.materias
       /*this.initFiltroMat();/*/},//esto cambiar cuando tenga el back
      error => console.log(error),
      () => console.log(this.materias)
    )
  }
  /*initFiltroMat(){
    this.materiasFiltro = this.materia!.valueChanges.pipe(
      startWith(''),
      map(mat => (mat ? this._filterMat(mat) : this.materias.slice())),
    );
  }*/
  /*
  private _filterMat(value: string): Materia[] {
    console.log(value);
    let filterValue ="";
    if(isNaN(Number(value))){//Porsi revisar
      filterValue = value.toLowerCase();
    }
    else{
      filterValue = this.displayFn(String(value))
    }
    //let nombre : string = this.displayFn(value)
    

    return this.materias.filter(mat => mat.asignatura.toLowerCase().includes(filterValue));
  }*/

  private _filterObjects(value: string | Materia): Materia[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    //console.log(this.materias[1]?.sigla)
    return this.materias.filter(
      (obj) =>
        obj.sigla?.toLowerCase().includes(filterValue) ||
        obj.asignatura.toLowerCase().includes(filterValue)
    );
  }

  /*
  displayFn(value: string) {    
    return this.materias.find(_ => _.asignatura === value || _.sigla === value)?.asignatura!;
  }*/
  displayFn(object: Materia): string {
    return object ? `${object.sigla} - ${object.asignatura}` : '';
  }

  addMateria(){
    //console.log(this.materia)
    this.dialogRef.close({ data: this.materia })
  }
}
