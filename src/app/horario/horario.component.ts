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
    '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30'
  ];
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
