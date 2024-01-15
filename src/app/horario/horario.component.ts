import { Component, OnInit } from '@angular/core';
import { SiaanServiceService } from '../siaan-service.service';
import { Materia } from '../interfaces/materia';
import { MatDialog } from '@angular/material/dialog';
import { NuevaMateriaComponent } from '../modals/nueva-materia/nueva-materia.component';
import { HorarioMateria } from '../interfaces/horario-materia';
import { LoaderService } from '../servicios/loader.service';
import {catchError, forkJoin, throwError} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NuevoHorarioConfirmarComponent} from "../modals/nuevo-horario-confirmar/nuevo-horario-confirmar.component";
import {ConfirmarComponent} from "../modals/confirmar/confirmar.component";
import {ImpresionHorariosComponent} from "../impresion-horarios/impresion-horarios.component";
import {ActivatedRoute} from "@angular/router";
import {Horario} from "../interfaces/horario";
import {HorariosService} from "../servicios/horarios.service";
import {CarreraService} from "../servicios/carrera.service";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";

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
  segundoAnioChecked: boolean = false;
  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  carrerasPorDepartamento : any[] =  [
    {departamento: "MEDICINA", carreras: [
        {nombre: 'MEDICINA'},
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

  //previewIndices: { row: number, col: number }[] = [];
  isPreview: boolean[][] = [];
  carrera: any;
  materias: Materia[] = []
  _id: string | null ='';
  paralelos :HorarioMateria[] = []
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo', "cupos", "horarios", "button"];
  //dataSource = ELEMENT_DATA;
  clickedRows = new Set<HorarioMateria>();
  horarioSeleccionado :HorarioMateria[] = []
  errorAgregar = false;
  constructor(private ofertaSiaanService: OfertaSiaanService,private carreraService: CarreraService,private horariosService: HorariosService, private route: ActivatedRoute, private _snackBar: MatSnackBar,private siaanService: SiaanServiceService,public dialog: MatDialog, public loaderService: LoaderService){
    this.inicializarFalsoEstilo()
    //this.carrera.nombre = ""
  }

  openDialogPrint(): void {
    const dialogRef = this.dialog.open(ImpresionHorariosComponent, {
      data: {carrera: this.carrera.nombre, horario: this.horarioSeleccionado, segundoAnio: this.segundoAnioChecked},
      height: '98%',
      width: '55%',
    });
  }

  updateHorario(){
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      data: {mensaje: "¿Desea actualizar este horario con la configuración actual?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updateOpcion()

        //this.materias = this.materias.filter(item => item.sigla !== materia.sigla);
        //this.borrarHorario(materia.paralelos![0])
      }
    });
  }

  updateOpcion(){
      this.horariosService
        .updateHorario(this._id!,this.horarioSeleccionado)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // Handle the error here
            console.error('An error occurred:', error);
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              showConfirmButton: false,
              timer: 3000
            })
            return throwError('Something went wrong; please try again later.'); // Optional: Rethrow the error or return a custom error message
          })
        )
        .subscribe(data =>{
            Swal.fire({
              icon: 'success',
              title: 'Se ha actualizado el horario correctamente',
              showConfirmButton: false,
              timer: 1500
            })
          }
        );
  }
  guardarHorario(){
    const dialogRef = this.dialog.open(NuevoHorarioConfirmarComponent, {
      data: {horario: this.horarioSeleccionado},
    });

  }
  inicializarFalsoEstilo(){
    this.isPreview= [];
    this.userScheduleData.forEach(row => this.isPreview.push(new Array(row.length).fill(false)));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>
    {
      this._id = params.get('_id');
    });
    if (this._id) {
      this.getValueCarrera()
      this.getHorario()
    }
  }

  getValueCarrera(){
    this.carrera = this.carreraService.carrera;
  }

  getParalelosMaterias(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        // Handle the result here
        this.paralelos = result
        /*if (this.paralelos.length == 0){
          this.openSnackBar()
        }*/
        //console.log(result);
        this.agruparCursos()
      },
      error => {
        console.error(error);
      }
    )
  }
  getHorario() {
    this.horariosService.getHorarioById(this._id!).subscribe(
      (data: Horario) => {
        // Save the token in your app's cookies for later use
        //this.horarioSeleccionado = data.horario;
        data.horario.map(paralelo => this.fijarHorario(paralelo,true))
        this.getParalelosMaterias()
      },
      (error) => {
        // Handle login error
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
    this.showMateriasAndParalelos()
  }

  showMateriasAndParalelos(){
    this.horarioSeleccionado.map(materia => {
      this.materias.push(this.ofertaAcademicaSiaan[materia.sigla])
      //this.materias[-1].paralelos.find(paralelo => paralelo)
    })
    this.updateSelected()

  }

  updateSelected() {
    this.materias.map((materia) =>{
      materia.paralelos!.forEach(paralelo1 => {
        const coincidencia = this.horarioSeleccionado.find(paralelo2 => paralelo2.paralelo === paralelo1.paralelo && paralelo2.sigla === paralelo1.sigla);

        if (coincidencia) {
          paralelo1.selected = true;
        }
      });
    })

  }
  changeToSecondYear(){
    this.segundoAnioChecked = !this.segundoAnioChecked
    if(this.segundoAnioChecked){
      this.cambiarHorarioNormal()
    }
    else{
      this.cambiarHorarioMedicina()
    }
  }
  separarHorario(horario: string){
    let res =horario.split(",")
    const trimmedStrings: string[] = res.map(str => str.trimStart());
    return trimmedStrings
  }

  eliminarMateria(materia: Materia): void{
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      data: {mensaje: "¿Desea eliminar esta materia del horario?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.materias = this.materias.filter(item => item.sigla !== materia.sigla);
        this.borrarHorario(materia.paralelos![0])
      }
    });

  }
  borrarHorario(paral:HorarioMateria): void {
      paral.selected = false;
      this.deleteHorarioMateria(paral)
  }

  separarHora(horarioSeparado:string): string[] {
    const timeSlotRange =horarioSeparado.split(' - ');
    return [timeSlotRange[0], timeSlotRange[1]]
  }
  materiaTieneChoque(paral:HorarioMateria): boolean {
    let horarioSeparado = this.separarHorario(paral.horario)

    for (let i = 0; i < horarioSeparado.length; i = i + 2) {
      let diaMateriaNueva = this.days.indexOf(horarioSeparado[i])
      //let horarioMateriaNueva = horarioSeparado[i + 1];
      let horasInicioFin = this.separarHora(horarioSeparado[i + 1])
      //console.log(horasInicioFin)
      for (let j = 0; j < this.horarioSeleccionado.length; j++) {
        let horarioSeparadoAntigua = this.separarHorario(this.horarioSeleccionado[j].horario)
        for (let k = 0; k < horarioSeparadoAntigua.length; k = k + 2) {
          let diaMateriaAntigua = this.days.indexOf(horarioSeparadoAntigua[k])
          //let horarioMateriaAntigua = horarioSeparadoAntigua[k + 1];
          let horasInicioFinAntigua = this.separarHora(horarioSeparadoAntigua[k + 1])
          if (diaMateriaAntigua === diaMateriaNueva) {
            if (horasInicioFinAntigua.some(item => horasInicioFin.includes(item))) {
              //console.log(paral.sigla + "Tuene choque")
              return true;
            }
          }
        }
      }
    }
    return false;
      /*let dia = this.days.indexOf(horarioSeparado[i])
      //Trabajamos con la hora
      const timeSlotRange =horarioSeparado[i + 1].split(' - ');
      let horasInicioFin = [timeSlotRange[0], timeSlotRange[1]]
      const horas: number[] = this.timeSlots
        .map((item, index) => (horasInicioFin.some(substring => item.includes(substring)) ? index : -1))
        .filter(index => index !== -1);
      for (let i =0; i<horas.length; i ++){
        this.userScheduleData[horas[i]][dia] = paral.sigla!;
        this.isPreview[horas[i]][dia] = true;
      }*/
  }
  materiaEstaAgregadaAlHorario(paral:HorarioMateria): boolean{
    if(this.carrera.nombre === "MEDICINA")
    {
      return this.horarioSeleccionado.some(item => item.sigla === paral.sigla && item.paralelo[0] !== paral.paralelo[0]);
    }
    else{
      return this.horarioSeleccionado.some(item => item.sigla === paral.sigla);
    }
  }

  materiaExisteEnHorario(sigla : string) : boolean {
    if(this.carrera.nombre != "MEDICINA")
    {
      return this.horarioSeleccionado.some(item => item.sigla === sigla);
    }
    else{
      return false
      //return this.horarioSeleccionado.some(item => item.sigla === paral.sigla);
    }
  }
  cambiarHorarioCarrera(value: any) {
    //this.carrera = value.nombre;
    if(value.nombre === "MEDICINA"){
      this.cambiarHorarioMedicina()
    }
    else{
        this.cambiarHorarioNormal()
    }
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
  deleteHorarioMateria(paral:HorarioMateria){
    let modifiedArray;
    if(paral.paralelo.includes("-")){
      const sigla = paral.sigla + " - " + paral.paralelo.split("-")[1]
      modifiedArray = this.userScheduleData.map(innerArray =>
        innerArray.map(item => item === sigla ? "" : item)
      );
    }
    else{
      modifiedArray = this.userScheduleData.map(innerArray =>
        innerArray.map(item => item === paral.sigla ? "" : item)
      );
    }


    this.userScheduleData = modifiedArray;
    this.quitarParaleloAHorarioFinal(paral);
    this.inicializarFalsoEstilo()
  }

  isMedicina() : boolean{
    if(this.carrera){
      return this.carrera.nombre == "MEDICINA"
    }
    return false;
  }
  fijarHorario(paral:HorarioMateria, isClicked: boolean, isNewHorario= true ): void {
    //if (this.isHovered) {
      this.materiaTieneChoque(paral)//eliminar
      let horarioSeparado = this.separarHorario(paral.horario)
      for (let i =0; i<horarioSeparado.length; i =i + 2){
        let dia = this.days.indexOf(horarioSeparado[i])
        //Trabajamos con la hora
        let horas: number[] =[];
        if(this.timeSlots.some(x=> x === horarioSeparado[i + 1]))
        {
          horas.push(this.timeSlots.indexOf(horarioSeparado[i + 1]))
        }
        else{
          const timeSlotRange =horarioSeparado[i + 1].split(' - ');
          let horasInicioFin = [timeSlotRange[0], timeSlotRange[1]]
          //console.log(horasInicioFin)
          if(this.carrera.nombre === "MEDICINA"){
            horas = this.timeSlots
              .map((item, index) => (item.split(' - ')[0] == horasInicioFin[0] || item.split(' - ')[1] == horasInicioFin[1] ? index : -1))
              .filter(index => index !== -1);
          }
          else{
            horas = this.timeSlots
              .map((item, index) => (horasInicioFin.some(substring => item.includes(substring)) ? index : -1))
              .filter(index => index !== -1);
          }
        }

        for (let i =0; i<horas.length; i ++){
          if(paral.paralelo.includes("-")){
            const sigla = paral.sigla + " - " + paral.paralelo.split("-")[1]
            this.userScheduleData[horas[i]][dia] = sigla;
            this.isPreview[horas[i]][dia] = true;//!this.highlighted[1][1];
          }
          else{
            this.userScheduleData[horas[i]][dia] = paral.sigla!;
            this.isPreview[horas[i]][dia] = true;//!this.highlighted[1][1];
          }

          //this.previewIndices.push({ row: i, col: dia });
        }
        if(isClicked){
          paral.selected = true;
        }
      }

    this.agregarParaleloAHorarioFinal(paral);

    //}
  }

  agregarParaleloAHorarioFinal(paral: HorarioMateria){
    console.log(paral)
    this.horarioSeleccionado.push(paral)
  }
  quitarParaleloAHorarioFinal(paral: HorarioMateria){
    this.horarioSeleccionado = this.horarioSeleccionado.filter(item => item.sigla !== paral.sigla || item.paralelo !== paral.paralelo);
    console.log(this.horarioSeleccionado)
  }
  isHighlighted(row: number, col: number): boolean {
    return this.isPreview[row] && this.isPreview[row][col];
  }

  openSnackBar(mensaje: string): void {
    this._snackBar.open(mensaje, 'Aceptar', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 5000
    });
  }


  openDialog(): void {
    try{
      this.errorAgregar = false
      const dialogRef = this.dialog.open(NuevaMateriaComponent, {
        data: {carrera: this.carrera.nombre},
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(this.materias.some(x=> x.sigla ===result.data.sigla)){
          this.openSnackBar("Esta materia ya está agregada al horario")
        }
        else {
          this.materias.push(result.data);
        }
        //console.log(this.ofertaAcademicaSiaan)
      });
    }
    catch{
      this.errorAgregar = true
    }

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
    console.log(this.carrera.nombre)
  }
}
