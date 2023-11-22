import { Component, OnInit } from '@angular/core';
import { SiaanServiceService } from '../siaan-service.service';
import { Materia } from '../interfaces/materia';
import { MatDialog } from '@angular/material/dialog';
import { NuevaMateriaComponent } from '../modals/nueva-materia/nueva-materia.component';
import { HorarioMateria } from '../interfaces/horario-materia';
import { LoaderService } from '../servicios/loader.service';
import {forkJoin, Observable} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Horario} from "../interfaces/horario";
import {HorariosService} from "../servicios/horarios.service";

@Component({
  selector: 'app-opciones-horarios',
  templateUrl: './opciones-horarios.component.html',
  styleUrls: ['./opciones-horarios.component.scss']
})
export class OpcionesHorariosComponent {
  paralelos :HorarioMateria[] = []
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

    userScheduleData: string[][] = [
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
  ];
  days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  timeSlots: string[] = [
    '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
    '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
    '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30',
    '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
  ];

  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  carrera: any;
  opcion?: number;
  materias: Materia[] = []
  opciones: number[] = [];
  horario!: Horario;
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo', 'cupos', 'horarios'];

  constructor(private _snackBar: MatSnackBar, private horariosService: HorariosService, private siaanService: SiaanServiceService, public dialog: MatDialog, public loaderService: LoaderService) {

  }
  getCupos(paraleloDeseado: HorarioMateria){
      return  this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find((paralelo) => paralelo.paralelo === paraleloDeseado.paralelo)?.disponibles ?? -1;
  }
    cambiarHorarioNormal() {
        this.timeSlots = [
            '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
            '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
            '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30',
            '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
        ];
        this.userScheduleData=  [
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
        ];
    }
  cambiarHorarioMedicina(){
        this.timeSlots = [
            '07:15 - 08:45', '08:45 - 09:30', '09:30 - 09:45', '09:45 - 10:00',
            '10:00 - 12:00', '12:00 - 12:15', '12:15 - 14:00', '14:00 - 14:45',
            '14:45 - 16:15', '16:15 - 17:00', '17:00 - 17:45', '17:45 - 20:00',
        ];
        this.userScheduleData= [
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', ''],
            ['', '', '', '', '', '']
        ];
    }
  getOptions(value: any) {
      this.getDatosSiaan()
      if(value.nombre == "MEDICINA"){
          this.cambiarHorarioMedicina()
      }
      else{
          this.cambiarHorarioNormal()
      }

    this.opcion = undefined;
    this.horariosService.getOpciones(value.nombre).subscribe(
      (data: number[]) => {
        // Save the token in your app's cookies for later use
        this.opciones = data;
        // Now you can use the 'appToken' cookie for making authenticated requests
      },
      (error) => {
        // Handle login error
      }
    )
  }

  getHorario(value: any) {
    this.borrarHorario()
    this.horariosService.getOpcionHorario(this.carrera.nombre, this.opcion!).subscribe(
      (data: Horario) => {
        // Save the token in your app's cookies for later use
        this.horario = data;
        this.horario.horario.map(paralelo => this.fijarHorario(paralelo))
        // Now you can use the 'appToken' cookie for making authenticated requests
      },
      (error) => {
        // Handle login error
      }
    )
  }
  separarHorario(horario: string){
    let res =horario.split(",")
    const trimmedStrings: string[] = res.map(str => str.trimStart());
    return trimmedStrings
  }
  fijarHorario(paral:HorarioMateria): void {
      let horarioSeparado = this.separarHorario(paral.horario)
      for (let i =0; i<horarioSeparado.length; i =i + 2) {
          let dia = this.days.indexOf(horarioSeparado[i])
          //Trabajamos con la hora
          let horas: number[] = [];
          if (this.timeSlots.some(x => x === horarioSeparado[i + 1])) {
              horas.push(this.timeSlots.indexOf(horarioSeparado[i + 1]))
          } else {
              const timeSlotRange = horarioSeparado[i + 1].split(' - ');
              let horasInicioFin = [timeSlotRange[0], timeSlotRange[1]]
              //console.log(horasInicioFin)
              if (this.carrera.nombre === "MEDICINA") {
                  horas = this.timeSlots
                      .map((item, index) => (item.split(' - ')[0] == horasInicioFin[0] || item.split(' - ')[1] == horasInicioFin[1] ? index : -1))
                      .filter(index => index !== -1);
              } else {
                  horas = this.timeSlots
                      .map((item, index) => (horasInicioFin.some(substring => item.includes(substring)) ? index : -1))
                      .filter(index => index !== -1);
              }
          }

          for (let i = 0; i < horas.length; i++) {
              if (paral.paralelo.includes("-")) {
                  const sigla = paral.sigla + " - " + paral.paralelo.split("-")[1]
                  this.userScheduleData[horas[i]][dia] = sigla;
              } else {
                  this.userScheduleData[horas[i]][dia] = paral.sigla!;
              }

              //this.previewIndices.push({ row: i, col: dia });
          }
      }
          //}
  }

  getDatosSiaan(){
      if(this.carrera.nombre === "MEDICINA"){
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
            disponibles: row[5] - row[6],
            horario: row[8],
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
        console.log(this.ofertaAcademicaSiaan)
    }
  borrarHorario(){
    for (let i = 0; i < this.userScheduleData.length; i++) {
      for (let j = 0; j < this.userScheduleData[i].length; j++) {
        this.userScheduleData[i][j] = "";
      }
    }
  }
}

