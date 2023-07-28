import { Component, OnInit } from '@angular/core';
import { SiaanServiceService } from '../siaan-service.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit{

  
  days: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  timeSlots: string[] = [
    '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
    '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
    '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30', 
    '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
  ];

  carrerasPorDepartamento : any[] =  [
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

  oferta:any[] = []
  constructor(private siaanService: SiaanServiceService){

  }
  	
  ngOnInit(): void {
    this.getDatos("ICmS2Zu87Y1a2ch%25252bDcfeUg==")
  }
  getDatos(carreraId: string){
    this.siaanService.getDatos(carreraId).subscribe(
      data => {
        this.oferta = this.filterData(data);
        console.log(this.oferta)
      },
    (error) =>{
      this.siaanService.getDatos(carreraId).subscribe(
        data => {
          this.oferta = this.filterData(data);
          console.log(this.oferta)
        }
      )
    }
    )
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

      return contenidoList;
  }
}
