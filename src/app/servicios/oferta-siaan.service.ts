import { Injectable } from '@angular/core';
import {catchError, forkJoin, map, Observable, of} from "rxjs";
import {SiaanServiceService} from "../siaan-service.service";
import {HorariosService} from "./horarios.service";
import {HorarioMateria} from "../interfaces/horario-materia";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Materia} from "../interfaces/materia";

@Injectable({
  providedIn: 'root'
})
export class OfertaSiaanService {
  paralelos :HorarioMateria[] = []
  materias: Materia[] = []
  carrerasPorDepartamento : any[] =  [
    {departamento: "MEDICINA", carreras: [
        {nombre: 'MEDICINA', codigo: "dXco5R3mrnsfT189GptIEg=="},
      ]},
    {departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS', codigo: "ICmS2Zu87Y1a2ch%25252bDcfeUg=="},
        {nombre: 'CONTADURÍA PÚBLICA', codigo: 'BMTCip8LyR2NuXi5k9Z%25252bxw=='},
        {nombre: 'INGENIERÍA COMERCIAL',codigo: 'p/JGTNn4GnenqvrntY8veQ=='},
        {nombre: 'INGENIERÍA FINANCIERA', codigo: 'WrdxKi286gKd8r4binzMNA=='}
      ]},
    {departamento: "DCEI", carreras: [
        {nombre: 'INGENIERÍA AMBIENTAL', codigo: 'K2tE0vGQS2qKvbaQtdynrQ=='},
        {nombre: 'ARQUITECTURA',codigo:  "2fo1BY/WoP%252bW0sVPqAWT6Q=="},
        {nombre: 'INGENIERÍA CIVIL',codigo: 'WfmpJZBesERhVa%252bCulQZLg=='},
        {nombre: 'INGENIERÍA INDUSTRIAL',codigo:  'G7LJJbzp/DcyD3/D/q3j2w=='},
        {nombre: 'INGENIERÍA QUÍMICA',codigo:  'zpZyULezcuEd3c2BrOwedQ=='},
        {nombre: 'INGENIERÍA MECATRÓNICA',codigo:  'nGZGf337ENww6bgV2IeV/A=='},
        {nombre: 'INGENIERÍA DE SISTEMAS',codigo:  'GDkBLqtHlyUrvv05l%252bcz5w=='},
        {nombre: 'INGENIERÍA EN TELECOMUNICACIONES',codigo:  'GVyyS1vv7gb/PQ2a4ajvNQ=='}
      ]},
    {departamento: "DCSH", carreras: [
        {nombre: 'ANTROPOLOGÍA', codigo:"tI9hh22QP0e7/9GjXhwhdg=="},
        {nombre: 'COMUNICACIÓN SOCIAL', codigo:'kX7kgYhRC1LUbnTDX5%252bVmw=='},
        {nombre: 'DERECHO',codigo:'f7hqNZVQNTi2REB9l/B5/g=='},
        {nombre: 'FILOSOFÍA Y LETRAS',codigo: 'AtldXj3SYazbYB94pwlWOQ=='},
        {nombre: 'PSICOLOGÍA',codigo: 'Nzp7sfyERT6IMiBxtHWpNw=='}
      ]},
    {departamento: "DCSH", carreras: [
        {nombre: 'CIENCIAS EXACTAS', codigo:"hnZqOrd3x0J5meyJY0UlCg=="},
        {nombre: 'PASTORAL UNIVERSITARIA', codigo:'ar5fLGPWaFBY769VhXhTWg=='},
        {nombre: 'IDIOMAS',codigo:'yEnQVCqv9j5/kHAsOhZ6AQ=='},
      ]}
  ]
  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  constructor( private _snackBar: MatSnackBar, private siaanService: SiaanServiceService,  private horariosService: HorariosService) { }
  getDatosSiaan(carrera: string): Observable<any> {
    let requests: Observable<any>[];

    if (carrera === 'MEDICINA') {
      requests = [
        this.siaanService.getDatos("dXco5R3mrnsfT189GptIEg==", "dz1tK1XOR8MjlSoqwp2RUw=="),
        this.siaanService.getDatos("dXco5R3mrnsfT189GptIEg==", "8RzubTahb3U78UzxLRQHUQ=="),
        this.siaanService.getDatos("ar5fLGPWaFBY769VhXhTWg==", "8RzubTahb3U78UzxLRQHUQ=="),
        this.siaanService.getDatos("yEnQVCqv9j5/kHAsOhZ6AQ==", "8RzubTahb3U78UzxLRQHUQ=="),
      ];
    } else {
      const payloads: string[] = this.carrerasPorDepartamento.flatMap(x => x.carreras.map((c: { codigo: any; }) => c.codigo));
      const idPeriodo = "8RzubTahb3U78UzxLRQHUQ==";
      requests = payloads.map(payload => this.siaanService.getDatos(payload, idPeriodo));
    }

    return this.forkRequestsSiaan(requests);
  }
  /*forkRequestsSiaan(requests: Observable<any>[]): Observable<any[]> {
    return forkJoin(requests).pipe(
      map(responses => {
        const paralelos: any[] = [];
        for (let i = 0; i < responses.length; i++) {
          paralelos.push(...this.filterData(responses[i]));
        }
        //this.agruparCursos();
        return paralelos;
      },)
    );
  }*/

  forkRequestsSiaan(requests: Observable<any>[]): Observable<any> {
    return new Observable(observer => {
      forkJoin(
        requests.map(request =>
          request.pipe(
            catchError(error => {
              // Handle error for individual request
              console.error('Request error:', error);

              // Return an observable with a placeholder value or an empty array/object to continue the flow
              return of(null);
            })
          )
        )
      ).subscribe(
        responses => {
          // Process all responses, even if some requests failed
          const paralelos = responses.reduce((acc, response) => (response !== null ? acc.concat(this.filterData(response)) : acc), []);
          observer.next(paralelos);
          observer.complete();
        },
        error => {
          // This block will only be executed if all requests fail
          observer.error(error);

        }
      );
    });
  }
  openSnackBar() {
    this._snackBar.open('Se ha actualizado el token. Por favor presione nuevamente el boton', 'Aceptar', {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
  filterData(response: any){
    const jsonData = response as any;

    const contenidoList: any[] = [];

    for (let i = 0; i < jsonData.datos.length; i++) {
      const column = jsonData.datos[i];
      const contenidoColumn: any[] = [];
      let profesor;
      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        let contenido = cell.contenidoCelda[0].contenido;

        if (cell.nombreColumna === "Horarios") {
          const horarios = cell.contenidoCelda[0].contenido.datos;
          let horariosString = "";
          let docente = "";
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
              else if (horarioCell.nombreColumna === "Docente") {
                profesor = horarioCell.contenidoCelda[0].contenido;
              }
            }
            horariosString += dia + ", " + horas + ", ";
          }
          contenido = horariosString.substring(0, horariosString.length - 2);
          //profesor =  docente.substring(0, docente.length - 2)
        }

        contenidoColumn.push(contenido);
        //contenidoColumn.push(profesor);
      }
      contenidoColumn.push(profesor);
      contenidoList.push(contenidoColumn);
    }
    //console.log(contenidoList[1])
    console.log(contenidoList)
    let resultado : HorarioMateria[] = contenidoList.map(row => ({
      sigla: row[1],
      materia: row[3],
      paralelo: row[2],
      disponibles: row[5] - row[6],
      horario: row[8],
      docente: row[9]
    }));
    return resultado;
    //return contenidoList;
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
    return this.ofertaAcademicaSiaan
    console.log(this.ofertaAcademicaSiaan)
  }
}
