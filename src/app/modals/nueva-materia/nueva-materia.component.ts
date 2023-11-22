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
  carrerasPorDepartamento : any[] =  [
    {departamento: "MEDICINA", carreras: [
        {nombre: 'MEDICINA', codigo: "dXco5R3mrnsfT189GptIEg=="},
      ]},
    {departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS', codigo: "ICmS2Zu87Y1a2ch%25252bDcfeUg=="},
        {nombre: 'CONTADURÍA PÚBLICA', codigo: 'BMTCip8LyR2NuXi5k9Z%25252bxw=='},
        {nombre: 'INGENIERÍA COMERCIAL',codigo: 'p/JGTNn4GnenqvrntY8veQ=='},
        //{nombre: 'INGENIERÍA FINANCIERA', codigo: 'WrdxKi286gKd8r4binzMNA=='}
      ]},
    {departamento: "DCEI", carreras: [
        //{nombre: 'INGENIERÍA AMBIENTAL', codigo: 'K2tE0vGQS2qKvbaQtdynrQ=='},
        //{nombre: 'ARQUITECTURA',codigo:  "2fo1BY/WoP%252bW0sVPqAWT6Q=="},
        {nombre: 'INGENIERÍA CIVIL',codigo: 'WfmpJZBesERhVa%252bCulQZLg=='},
        {nombre: 'INGENIERÍA INDUSTRIAL',codigo:  'G7LJJbzp/DcyD3/D/q3j2w=='},
        //{nombre: 'INGENIERÍA QUÍMICA',codigo:  'zpZyULezcuEd3c2BrOwedQ=='},
        {nombre: 'INGENIERÍA MECATRÓNICA',codigo:  'nGZGf337ENww6bgV2IeV/A=='},
        {nombre: 'INGENIERÍA DE SISTEMAS',codigo:  'GDkBLqtHlyUrvv05l%252bcz5w=='},
        {nombre: 'INGENIERÍA EN TELECOMUNICACIONES',codigo:  'GVyyS1vv7gb/PQ2a4ajvNQ=='}
      ]},
    {departamento: "DCSH", carreras: [
        {nombre: 'ANTROPOLOGÍA', codigo:"tI9hh22QP0e7/9GjXhwhdg=="},
        {nombre: 'COMUNICACIÓN SOCIAL', codigo:'kX7kgYhRC1LUbnTDX5%252bVmw=='},
        //{nombre: 'DERECHO',codigo:'f7hqNZVQNTi2REB9l/B5/g=='},
        //{nombre: 'FILOSOFÍA Y LETRAS',codigo: 'AtldXj3SYazbYB94pwlWOQ=='},
        {nombre: 'PSICOLOGÍA',codigo: 'Nzp7sfyERT6IMiBxtHWpNw=='}
      ]}
  ]
  paralelos :HorarioMateria[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<NuevaMateriaComponent>,private _snackBar: MatSnackBar,public loaderService: LoaderService, private planesServicio: PlanesService,private siaanService: SiaanServiceService){
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
    if(this.carrera === "MEDICINA"){
      const requests : Observable<any>[] = [this.siaanService.getDatos("dXco5R3mrnsfT189GptIEg==","dz1tK1XOR8MjlSoqwp2RUw=="), this.siaanService.getDatos("dXco5R3mrnsfT189GptIEg==","8RzubTahb3U78UzxLRQHUQ==")]
      this.forkRequestsSiaan(requests)
    }
    else{
      const payloads :string[] =this.carrerasPorDepartamento.flatMap(x => x.carreras.map((c: { codigo: any; }) => c.codigo))
      //const payloads = ["GDkBLqtHlyUrvv05l%25252bcz5w=="];
      const idPeriodo = "8RzubTahb3U78UzxLRQHUQ=="
      const requests : Observable<any>[] = payloads.map(payload => this.siaanService.getDatos(payload,idPeriodo));
      this.forkRequestsSiaan(requests)
    }


  }

  forkRequestsSiaan(requests: Observable<any>[]) {
    forkJoin(requests).subscribe(
      responses => {
        // Handle responses from all parallel requests
        for (let i =0; i<responses.length; i++){
          this.paralelos.push(...this.filterData(responses[i]))
        }
        this.agruparCursos()
      },
      error => {
        this.openSnackBar()
      }
    );
  }
filterData(response: any){
    const jsonData = response as any;

    const contenidoList: any[] = [];

    for (let i = 0; i < jsonData.datos.length; i++) {
      const column = jsonData.datos[i];
      const contenidoColumn: any[] = [];

      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        let contenido = cell.contenidoCelda[0].contenido;

        if (cell.nombreColumna === "Horarios") {
          const horarios = cell.contenidoCelda[0].contenido.datos;
          let horariosString = "";
          for (let k = 0; k < horarios.length; k++) {
            const horario = horarios[k];
            let dia = "";
            let horas = "";
            for (let l = 0; l < horario.length; l++) {
              const horarioCell = horario[l];
              if (horarioCell.nombreColumna === "Día") {
                dia = horarioCell.contenidoCelda[0].contenido;
              } else if (horarioCell.nombreColumna === "Horas") {
                horas = horarioCell.contenidoCelda[0].contenido;
              }
            }
            horariosString += dia + ", " + horas + ", ";
          }
          contenido = horariosString.substring(0, horariosString.length - 2);
        }

        contenidoColumn.push(contenido);
      }

      contenidoList.push(contenidoColumn);
    }
    //console.log(contenidoList[1])
    console.log(contenidoList)
    let resultado : HorarioMateria[] = contenidoList.map(row => ({
      sigla: row[1],
      materia: row[3],
      paralelo: row[2],
      cupos: row[5],
      inscritos: row[6],
      disponibles: row[5] - row[6],
      horario: row[8],
    }));
    return resultado;
    //return contenidoList;
  }
  openSnackBar() {
    this._snackBar.open('Se ha actualizado el token. Por favor presione nuevamente el boton', 'Aceptar', {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
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

  displayFn(object: Materia): string {
    return object ? `${object.sigla} - ${object.asignatura}` : '';
  }

  addMateria(){
    //console.log(this.materia)
    this.dialogRef.close({ data: this.materia })
  }
}
