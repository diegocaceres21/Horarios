import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {catchError, map, startWith, throwError} from "rxjs";
import {HorarioMateria} from "../../interfaces/horario-materia";
import {HorariosService} from "../../servicios/horarios.service";
import {Horario} from "../../interfaces/horario";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-nuevo-horario-confirmar',
  templateUrl: './nuevo-horario-confirmar.component.html',
  styleUrls: ['./nuevo-horario-confirmar.component.scss']
})
export class NuevoHorarioConfirmarComponent implements OnInit{
  carrera?: string;
  comentarios?: string;
  horarios?: HorarioMateria[]
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<NuevoHorarioConfirmarComponent>,private horariosService: HorariosService) {
  }
  ngOnInit() {
    this.horarios = this.data.horario;
  }
  crearMateria(){
    let horario : Horario = {
      carrera: this.carrera!,
      comentario: this.comentarios,
      horario: this.horarios!
    }
    //console.log(horario)
    this.horariosService
      .crearHorario(horario)
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
            title: 'Se ha guardado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
        }
      );//this.nuevo = data

    this.dialogRef.close({ data: true })
  }

}
