import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

import {ImpresionHorariosComponent} from "../impresion-horarios/impresion-horarios.component";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";


@Component({
  selector: 'app-opciones-horarios',
  templateUrl: './opciones-horarios.component.html',
  styleUrls: ['./opciones-horarios.component.scss']
})
export class OpcionesHorariosComponent {
  @ViewChild('horarioContent', { static: false }) contentReady!: ElementRef;

  paralelos :HorarioMateria[] = []

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

  constructor(private ofertaSiaanService: OfertaSiaanService,private _snackBar: MatSnackBar, private horariosService: HorariosService, private siaanService: SiaanServiceService, public dialog: MatDialog, public loaderService: LoaderService) {

  }


  getCupos(paraleloDeseado: HorarioMateria) : number{
    const cupos = this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find((paralelo) => paralelo.paralelo === paraleloDeseado.paralelo)?.disponibles ?? -1;
    console.log(cupos)
    return cupos
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
    this.ofertaSiaanService.getDatosSiaan(this.carrera.nombre).subscribe(
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
  borrarHorario(){
    for (let i = 0; i < this.userScheduleData.length; i++) {
      for (let j = 0; j < this.userScheduleData[i].length; j++) {
        this.userScheduleData[i][j] = "";
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ImpresionHorariosComponent, {
      data: {carrera: this.carrera.nombre},
      height: '98%',
      width: '55%',
    });
  }
}

