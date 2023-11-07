import { Component, OnInit } from '@angular/core';
import { SiaanServiceService } from '../siaan-service.service';
import { Materia } from '../interfaces/materia';
import { MatDialog } from '@angular/material/dialog';
import { NuevaMateriaComponent } from '../modals/nueva-materia/nueva-materia.component';
import { HorarioMateria } from '../interfaces/horario-materia';
import { LoaderService } from '../servicios/loader.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Horario} from "../interfaces/horario";
import {HorariosService} from "../servicios/horarios.service";

@Component({
  selector: 'app-opciones-horarios',
  templateUrl: './opciones-horarios.component.html',
  styleUrls: ['./opciones-horarios.component.scss']
})
export class OpcionesHorariosComponent {

  carrerasPorDepartamento: any[] = [
    {
      departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS', codigo: "ICmS2Zu87Y1a2ch%25252bDcfeUg=="},
        {nombre: 'CONTADURÍA PÚBLICA', codigo: 'BMTCip8LyR2NuXi5k9Z%25252bxw=='},
        {nombre: 'INGENIERÍA COMERCIAL', codigo: 'p/JGTNn4GnenqvrntY8veQ=='},
        {nombre: 'INGENIERÍA FINANCIERA', codigo: 'WrdxKi286gKd8r4binzMNA=='}
      ]
    },
    {
      departamento: "DCEI", carreras: [
        {nombre: 'INGENIERÍA AMBIENTAL', codigo: 'K2tE0vGQS2qKvbaQtdynrQ=='},
        {nombre: 'ARQUITECTURA', codigo: "2fo1BY/WoP%252bW0sVPqAWT6Q=="},
        {nombre: 'INGENIERÍA CIVIL', codigo: 'WfmpJZBesERhVa%252bCulQZLg=='},
        {nombre: 'INGENIERÍA INDUSTRIAL', codigo: 'G7LJJbzp/DcyD3/D/q3j2w=='},
        {nombre: 'INGENIERÍA QUÍMICA', codigo: 'zpZyULezcuEd3c2BrOwedQ=='},
        {nombre: 'INGENIERÍA MECATRÓNICA', codigo: 'nGZGf337ENww6bgV2IeV/A=='},
        {nombre: 'INGENIERÍA DE SISTEMAS', codigo: 'GDkBLqtHlyUrvv05l%252bcz5w=='},
        {nombre: 'INGENIERÍA EN TELECOMUNICACIONES', codigo: 'GVyyS1vv7gb/PQ2a4ajvNQ=='}
      ]
    },
    {
      departamento: "DCSH", carreras: [
        {nombre: 'ANTROPOLOGÍA', codigo: "tI9hh22QP0e7/9GjXhwhdg=="},
        {nombre: 'COMUNICACIÓN SOCIAL', codigo: 'kX7kgYhRC1LUbnTDX5%252bVmw=='},
        {nombre: 'DERECHO', codigo: 'f7hqNZVQNTi2REB9l/B5/g=='},
        {nombre: 'FILOSOFÍA Y LETRAS', codigo: 'AtldXj3SYazbYB94pwlWOQ=='},
        {nombre: 'PSICOLOGÍA', codigo: 'Nzp7sfyERT6IMiBxtHWpNw=='}
      ]
    }
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


  carrera: any;
  opcion?: number;
  materias: Materia[] = []
  opciones: number[] = [];
  horario!: Horario;
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo', 'cupos', 'horarios'];

  constructor(private horariosService: HorariosService, private siaanService: SiaanServiceService, public dialog: MatDialog, public loaderService: LoaderService) {

  }

  getOptions(value: any) {
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
    for (let i =0; i<horarioSeparado.length; i =i + 2){
      let dia = this.days.indexOf(horarioSeparado[i])
      let horas: number[] =[];
      if(this.timeSlots.some(x=> x === horarioSeparado[i + 1]))
      {
        horas.push(this.timeSlots.indexOf(horarioSeparado[i + 1]))
      }
      else{
        const timeSlotRange =horarioSeparado[i + 1].split(' - ');
        let horasInicioFin = [timeSlotRange[0], timeSlotRange[1]]
        horas = this.timeSlots
          .map((item, index) => (horasInicioFin.some(substring => item.includes(substring)) ? index : -1))
          .filter(index => index !== -1);
      }

      for (let i =0; i<horas.length; i ++){
        this.userScheduleData[horas[i]][dia] = paral.sigla!;
      }

      //this.userScheduleData[hora][dia] = paral.sigla!;
    }
    //}
  }

  borrarHorario(){
    for (let i = 0; i < this.userScheduleData.length; i++) {
      for (let j = 0; j < this.userScheduleData[i].length; j++) {
        this.userScheduleData[i][j] = "";
      }
    }
  }
}

