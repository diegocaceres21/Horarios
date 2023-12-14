import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Observable, map, startWith, forkJoin} from 'rxjs';
import { Materia } from 'src/app/interfaces/materia';
import { PlanesService } from 'src/app/servicios/planes.service';
import {LoaderService} from "../../servicios/loader.service";
import {HorarioMateria} from "../../interfaces/horario-materia";
import {SiaanServiceService} from "../../siaan-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OfertaSiaanService} from "../../servicios/oferta-siaan.service";

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
  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};

  paralelos :HorarioMateria[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private ofertaSiaanService: OfertaSiaanService,private dialogRef: MatDialogRef<NuevaMateriaComponent>,private _snackBar: MatSnackBar,public loaderService: LoaderService, private planesServicio: PlanesService,private siaanService: SiaanServiceService){
    this.carrera = data.carrera;
  }

  async ngOnInit() {
   this.getDatos()//this.getMaterias()
     //Agregar carrera
    this.materiasFiltro = this.objectControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterObjects(value))
    );

  }
  getDatos(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        // Handle the result here
        this.paralelos = result
        console.log(result);
        this.agruparCursos()
        // Call another function or do something else with the result
      },
      error => {
        // Handle error
        console.error(error);
      }
    )
  }
  agruparCursos() {

    this.paralelos.forEach(curso => {
      const clave = curso.sigla!;
      if (!this.ofertaAcademicaSiaan[clave]) {
        this.ofertaAcademicaSiaan[clave] = {
          sigla: curso.sigla!,
          asignatura: curso.materia!,
          paralelos: []
        };
      }
      this.ofertaAcademicaSiaan[clave].paralelos!.push(curso);
    });
    this.materias  = Object.values(this.ofertaAcademicaSiaan);
    console.log(this.ofertaAcademicaSiaan)
  }
  getMaterias(){
    this.planesServicio.getDatos().subscribe(
      (data) => {this.materias = data.materias
       /*this.initFiltroMat();/*/},//esto cambiar cuando tenga el back
      error => console.log(error),
      () => console.log(this.materias)
    )
  }

  private _filterObjects(value: string | Materia): Materia[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    //console.log(this.materias[1]?.sigla)
    return this.materias.filter(
      (obj) =>
        obj.sigla?.toLowerCase().includes(filterValue) ||
        obj.asignatura.toLowerCase().includes(filterValue)
    );
  }

  displayFn(object: Materia): string {
    return object ? `${object.sigla} - ${object.asignatura}` : '';
  }

  addMateria(){
    //console.log(this.materia)
    this.dialogRef.close({ data: this.materia })
  }
}
