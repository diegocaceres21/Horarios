import { Component, OnInit } from '@angular/core';
import { SiaanServiceService } from '../siaan-service.service';
import { Materia } from '../interfaces/materia';
import { MatDialog } from '@angular/material/dialog';
import { NuevaMateriaComponent } from '../modals/nueva-materia/nueva-materia.component';
import { HorarioMateria } from '../interfaces/horario-materia';
import { LoaderService } from '../servicios/loader.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit{

  isHovered = false;
  
  days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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

  //previewIndices: { row: number, col: number }[] = [];
  isPreview: boolean[][] = [];
  carrera: string = "";
  materias: Materia[] = []
  paralelos :HorarioMateria[] = []
  constructor(private _snackBar: MatSnackBar,private siaanService: SiaanServiceService,public dialog: MatDialog, public loaderService: LoaderService){
    this.inicializarFalsoEstilo()
  }
  	
  inicializarFalsoEstilo(){
    this.isPreview= [];
    this.userScheduleData.forEach(row => this.isPreview.push(new Array(row.length).fill(false)));
  }
  ngOnInit(): void {
    
  }

  actualizarParalelos(){
    this.paralelos = []
    this.getDatos("ICmS2Zu87Y1a2ch%25252bDcfeUg==")
  }
  getDatos(carreraId: string){
    const payloads = ["ICmS2Zu87Y1a2ch%25252bDcfeUg==","BMTCip8LyR2NuXi5k9Z%25252bxw==",
    "p/JGTNn4GnenqvrntY8veQ==","WrdxKi286gKd8r4binzMNA==","hnZqOrd3x0J5meyJY0UlCg==", "ar5fLGPWaFBY769VhXhTWg=="];

    const requests = payloads.map(payload => this.siaanService.getDatos(payload));

    forkJoin(requests).subscribe(
      responses => {
        // Handle responses from all parallel requests
        for (let i =0; i<responses.length; i++){
          this.paralelos.push(...this.filterData(responses[i]))
        }
        console.log(this.paralelos)
        this.findParalelosForMaterias()
      },
      error => {
        this.openSnackBar()
        /*const requests = payloads.map(payload => this.siaanService.getDatos(payload));
        forkJoin(requests).subscribe(
          responses => {
            // Handle responses from all parallel requests
            for (let i =0; i<responses.length; i++){
              this.paralelos.push(...this.filterData(responses[i]))
            }
            console.log('Responses:', responses);
            console.log(this.paralelos)
          }
        )*/
      }
    );
    /*
    this.siaanService.getDatos(carreraId).subscribe(
      data => {
        this.paralelos = this.filterData(data);
        console.log(this.paralelos)
      },
    (error) =>{
      this.siaanService.getDatos(carreraId).subscribe(
        data => {
          this.paralelos = this.filterData(data);
          console.log(this.paralelos)
        }
      )
    }
    )*/
  }

  separarHorario(horario: string){
    let res =horario.split(",")
    const trimmedStrings: string[] = res.map(str => str.trimStart());
    return trimmedStrings
  }

  onHover(paral:HorarioMateria){
    this.isHovered = true;
    
    /*for (let i =0; i<horarioSeparado.length; i+2){
      let dia = this.days.indexOf(horarioSeparado[i])
      let hora = this.timeSlots.indexOf(horarioSeparado[i + 1])
      this.userScheduleData[dia][hora] = paral.sigla!;
    }*/
    this.fijarHorario(paral);
  }
  stopFunction(paral:HorarioMateria): void {
    if(this.isHovered){
      this.isHovered = false;
      this.deleteHorarioMateria(paral)
   }
  }

  deleteHorarioMateria(paral:HorarioMateria){
    const modifiedArray = this.userScheduleData.map(innerArray =>
      innerArray.map(item => item === paral.sigla ? "" : item)
    );

    this.userScheduleData = modifiedArray;
    this.inicializarFalsoEstilo()
  }
  fijarHorario(paral:HorarioMateria): void {
    if (this.isHovered) {
      
      let horarioSeparado = this.separarHorario(paral.horario)
      console.log(horarioSeparado)
      for (let i =0; i<horarioSeparado.length; i =i + 2){
        let dia = this.days.indexOf(horarioSeparado[i])
        //Trabajamos con la hora
        const timeSlotRange =horarioSeparado[i + 1].split(' - ');
        let horasInicioFin = [timeSlotRange[0], timeSlotRange[1]]
        const horas: number[] = this.timeSlots
      .map((item, index) => (horasInicioFin.some(substring => item.includes(substring)) ? index : -1))
      .filter(index => index !== -1);
        for (let i =0; i<horas.length; i ++){
          this.userScheduleData[horas[i]][dia] = paral.sigla!;
          this.isPreview[horas[i]][dia] = true;//!this.highlighted[1][1];
          //this.previewIndices.push({ row: i, col: dia });
        }
        console.log(this.isPreview)
        console.log(this.userScheduleData)
        //this.userScheduleData[hora][dia] = paral.sigla!;
      }
      
    }
  }
  isHighlighted(row: number, col: number): boolean {
    return this.isPreview[row] && this.isPreview[row][col];
  }

  openSnackBar() {
    this._snackBar.open('Se ha actualizado el token. Por favor presione nuevamente el boton', 'Aceptar', {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  findParalelosForMaterias(){
    for (let i =0; i<this.materias.length; i++){
      let lista = this.paralelos.filter((item) => item.sigla === this.materias[i].sigla)
      this.materias[i].paralelos = lista;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NuevaMateriaComponent, {
      data: {carrera: this.carrera},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.materias.push(result.data);
      console.log(this.materias)
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

  agregarMateria(){
    console.log(this.carrera)
  }
}
