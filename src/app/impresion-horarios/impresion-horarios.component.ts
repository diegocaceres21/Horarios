import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef, EmbeddedViewRef,
  Inject,
  Injector,
  ViewChild
} from '@angular/core';
import {Horario} from "../interfaces/horario";
import {LoaderService} from "../servicios/loader.service";
import {forkJoin, Observable} from "rxjs";
import {SiaanServiceService} from "../siaan-service.service";
import {HorariosService} from "../servicios/horarios.service";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HorarioMateria} from "../interfaces/horario-materia";
//import {jsPDF} from "jspdf";
import html2pdf from 'html2pdf.js';

import html2canvas from "html2canvas";
import * as jspdf from "jspdf";
import "jspdf-autotable";
import autoTable, { UserOptions} from "jspdf-autotable";
import {jsPDF} from "jspdf";
import {UserScheduleData} from "../interfaces/user-schedule-data";
import {Materia} from "../interfaces/materia";


@Component({
  selector: 'app-impresion-horarios',
  templateUrl: './impresion-horarios.component.html',
  styleUrls: ['./impresion-horarios.component.scss']
})
export class ImpresionHorariosComponent {
  @ViewChild('horarioContent', { static: false }) contentReady!: ElementRef;

  carrera: string = "";
  paralelos :HorarioMateria[] = []
    ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  opciones: Horario[] = []
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo',"cupos", "docente"];
  days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  timeSlots: string[] = [
    '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
    '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
    '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30',
    '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
  ];
  userScheduleData: UserScheduleData[] = []
  generatePDF() {
    const pdf = new jsPDF("p","px","a4");

    this.opciones.forEach((item, index) => {
        if (index > 0) {
            pdf.addPage(); // Add a new page for each item after the first one
        }

        // Add title to the PDF
        pdf.setFontSize(22);
        pdf.setFont("times","bold")
        var width = pdf.internal.pageSize.getWidth()
      pdf.text("Opción " + item.opcion, width/2, 20, {
          align: 'center'
      });

      // Add table to the PDF using jsPDF.autotable
      //const columns = Object.keys(item.tableData[0]);
      //const rows = item.tableData.map(row => Object.values(row));

      autoTable(pdf,{html: '#table-' + index, theme: 'grid', headStyles: { halign: 'center', fillColor: [18, 4, 79] }, bodyStyles: { lineColor: [0,0,0]}});
      autoTable(pdf,{html: '#opcion-' + index, theme: 'grid',  headStyles: { halign: 'center', fillColor: [18, 4, 79] },bodyStyles: { halign: 'center', lineColor: [0,0,0]} });
    });

    // Save or open the generated PDF
    window.open(URL.createObjectURL(pdf.output('blob')));
    //pdf.save('output.pdf');
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ImpresionHorariosComponent>,private ofertaService: OfertaSiaanService, public loaderService: LoaderService, private siaanService: SiaanServiceService,  private horariosService: HorariosService) {
    this.carrera = data.carrera;
    if (data.horario){
      this.opciones.push({opcion: 1,carrera: data.carrera, horario: data.horario})
      if (data.carrera == "MEDICINA"){
        this.cambiarHorarioMedicina(0)
      }
      else{
        this.cambiarHorarioNormal(0)
      }
      this.opciones[0].horario.map(paralelo => this.fijarHorario(paralelo, 0))
      console.log(this.opciones)
    }
    else{
      this.getOptions()
      this.getDatosSiaan()
    }

  }

    getCupos(paraleloDeseado: HorarioMateria){
        return  this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find((paralelo) => paralelo.paralelo === paraleloDeseado.paralelo)?.disponibles ?? -1;
    }

    getDocente(paraleloDeseado: HorarioMateria){
        return  this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find((paralelo) => paralelo.paralelo === paraleloDeseado.paralelo)?.docente ?? "";
    }

  cambiarHorarioNormal(index :number) {
    this.timeSlots = [
      '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
      '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
      '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30',
      '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
    ];
      let newSchedule : UserScheduleData = {
          schedule: [
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
          ]};
      this.userScheduleData.push(newSchedule)
  }
  cambiarHorarioMedicina(index:number){
    this.timeSlots = [
      '07:15 - 08:45', '08:45 - 09:30', '09:30 - 09:45', '09:45 - 10:00',
      '10:00 - 12:00', '12:00 - 12:15', '12:15 - 14:00', '14:00 - 14:45',
      '14:45 - 16:15', '16:15 - 17:00', '17:00 - 17:45', '17:45 - 20:00',
    ];
    let newSchedule : UserScheduleData = {
        schedule: [
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
        ]};
    this.userScheduleData.push(newSchedule)
  }
  getOptions() {
    //this.getDatosSiaan()
    /*if(this.carrera == "MEDICINA"){
      this.cambiarHorarioMedicina()
    }
    else{
      this.cambiarHorarioNormal()
    }*/

    this.horariosService.getHorarios(this.carrera).subscribe(
      (data: Horario[]) => {
        // Save the token in your app's cookies for later use

        this.opciones = data;

        for(let i = 0; i < this.opciones.length; i++){
            if(this.carrera == "MEDICINA"){
                this.cambiarHorarioMedicina(i)
            }
            else{
                this.cambiarHorarioNormal(i)
            }
          this.opciones[i].horario.map(paralelo => this.fijarHorario(paralelo, i))
        }

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
  fijarHorario(paral:HorarioMateria, indexSchedule: number): void {
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
        if (this.carrera === "MEDICINA") {
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
          this.userScheduleData[indexSchedule].schedule[horas[i]][dia] = sigla;
        } else {
          this.userScheduleData[indexSchedule].schedule[horas[i]][dia] = paral.sigla!;
        }

        //this.previewIndices.push({ row: i, col: dia });
      }
    }
    //}
  }
  getDatosSiaan(){
    this.ofertaService.getDatosSiaan(this.carrera).subscribe(
      (data) => {
        this.paralelos = data
          this.agruparCursos()
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
        //this.materias  = Object.values(this.ofertaAcademicaSiaan);
        console.log(this.ofertaAcademicaSiaan)
    }


}
