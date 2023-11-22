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

  carrerasPorDepartamento : any[] =  [
    {departamento: "MEDICINA", carreras: [
        {nombre: 'MEDICINA'},
      ]},
    {departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS'},
        {nombre: 'CONTADURÍA PÚBLICA'},
        {nombre: 'INGENIERÍA COMERCIAL'},
        {nombre: 'INGENIERÍA EMPRESARIAL'},
        {nombre: 'INGENIERÍA FINANCIERA'}
      ]},
    {departamento: "DCEI", carreras: [
        {nombre: 'ARQUITECTURA'},
        {nombre: 'INGENIERÍA AMBIENTAL'},
        {nombre: 'INGENIERÍA CIVIL',},
        {nombre: 'INGENIERÍA INDUSTRIAL'},
        {nombre: 'INGENIERÍA MECATRÓNICA'},
        {nombre: 'INGENIERÍA QUÍMICA'},
        {nombre: 'INGENIERÍA DE SISTEMAS'},
        {nombre: 'INGENIERÍA EN TELECOMUNICACIONES'}
      ]},
    {departamento: "DCSH", carreras: [
        {nombre: 'ANTROPOLOGÍA'},
        {nombre: 'COMUNICACIÓN SOCIAL'},
        {nombre: 'DERECHO'},
        {nombre: 'DISEÑO DIGITAL MULTIMEDIA'},
        {nombre: 'FILOSOFÍA Y LETRAS'},
        {nombre: 'PSICOLOGÍA'}
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


  carrera: any;
  opcion?: number;
  materias: Materia[] = []
  opciones: number[] = [];
  horario!: Horario;
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo', 'cupos', 'horarios'];

  constructor(private horariosService: HorariosService, private siaanService: SiaanServiceService, public dialog: MatDialog, public loaderService: LoaderService) {

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

  borrarHorario(){
    for (let i = 0; i < this.userScheduleData.length; i++) {
      for (let j = 0; j < this.userScheduleData[i].length; j++) {
        this.userScheduleData[i][j] = "";
      }
    }
  }
}

