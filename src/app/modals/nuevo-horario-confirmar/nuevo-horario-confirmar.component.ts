import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {catchError, throwError} from "rxjs";
import {HorarioMateria} from "../../interfaces/horario-materia";
import {HorariosService} from "../../servicios/horarios.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-horario-confirmar',
  templateUrl: './nuevo-horario-confirmar.component.html',
  styleUrls: ['./nuevo-horario-confirmar.component.scss']
})
export class NuevoHorarioConfirmarComponent implements OnInit {
  form: FormGroup;
  horarios?: HorarioMateria[];
  carrerasPorDepartamento: any[] = [
    {departamento: "CIENCIAS DE LA SALUD", carreras: [
        {nombre: 'MEDICINA'},
        {nombre: 'ODONTOLOGÍA'},
      ]},
    {departamento: "DAEF", carreras: [
        {nombre: 'ADMINISTRACIÓN DE EMPRESAS'},
        {nombre: 'CONTADURÍA PÚBLICA'},
        {nombre: 'INGENIERÍA COMERCIAL'},
        {nombre: 'INGENIERÍA EN COMERCIO Y FINANZAS INTERNACIONALES'},
        {nombre: 'INGENIERÍA EMPRESARIAL'},
        {nombre: 'INGENIERÍA FINANCIERA'}
      ]},
    {departamento: "DCEI", carreras: [
        {nombre: 'ARQUITECTURA'},
        {nombre: 'INGENIERÍA AMBIENTAL'},
        {nombre: 'INGENIERÍA CIVIL'},
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
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<NuevoHorarioConfirmarComponent>,
              private horariosService: HorariosService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      carrera: ['', Validators.required],
      comentarios: [''],
      traspaso: ['NUEVO', Validators.required]
    });
  }

  ngOnInit() {
    this.horarios = this.data.horario;
  }

  crearMateria() {
    if (this.form.invalid) {
      return;
    }

    const horario = {
      carrera: this.form.value.carrera,
      comentario: this.form.value.comentarios,
      horario: this.horarios!,
      tipo: this.form.value.traspaso
    };

    this.horariosService
      .crearHorario(horario)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            showConfirmButton: false,
            timer: 3000
          });
          return throwError('Something went wrong; please try again later.');
        })
      )
      .subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Se ha guardado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      });

    this.dialogRef.close({ data: true });
  }
}
