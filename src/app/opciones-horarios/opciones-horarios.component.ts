import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SiaanService } from '../servicios/siaan.service';
import { Materia } from '../interfaces/materia';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../servicios/loader.service';
import { HorarioMateria } from '../interfaces/horario-materia';
import { Horario } from '../interfaces/horario';
import { HorariosService } from '../servicios/horarios.service';
import { OfertaSiaanService } from '../servicios/oferta-siaan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ConfirmarComponent } from '../modals/confirmar/confirmar.component';
import { ImpresionHorariosComponent } from '../impresion-horarios/impresion-horarios.component';
import { CarreraService } from '../servicios/carrera.service';
import {catchError, take, throwError} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {TokenService} from "../servicios/token.service";
import {RefreshService} from "../servicios/refresh.service";

@Component({
  selector: 'app-opciones-horarios',
  templateUrl: './opciones-horarios.component.html',
  styleUrls: ['./opciones-horarios.component.scss']
})
export class OpcionesHorariosComponent implements OnInit {
  @ViewChild('horarioContent', { static: false }) contentReady!: ElementRef;

  paralelos: HorarioMateria[] = [];
  tipoHorario: string = 'NUEVO';
  userScheduleData: string[][] = Array(16).fill(Array(6).fill(''));
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
  materias: Materia[] = [];
  opciones: number[] = [];
  horario?: Horario;
  displayedColumns: string[] = ['sigla', 'materia', 'docente', 'paralelo', 'cupos', 'horario'];

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private siaanService: SiaanService,
    private carreraService: CarreraService,
    private router: Router,
    private ofertaSiaanService: OfertaSiaanService,
    private _snackBar: MatSnackBar,
    private horariosService: HorariosService,
    public dialog: MatDialog,
    public loaderService: LoaderService,
    private tokenService: TokenService,
    private refreshService: RefreshService
  ) {}

  ngOnInit() {
    if(!this.tokenService.getTokenSiaan()){
      this.loginSiaan();
    }
    else {
      this.getDatosSiaan();
    }
  }

  loginSiaan() {
    const payload = {
      Email: this.cookieService.get('email'),
      UniqueCode: localStorage.getItem('uniquecodeadm'),
      ServiceCode: '1'
    };
    this.siaanService.loginSiaan(payload).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.tokenService.setTokenSiaan();
        this.refreshService.refresh();
        this.getDatosSiaan()
      },
      error: () => {}
    });
  }

  getDocente(paraleloDeseado: HorarioMateria): string {
    return this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find(paralelo => paralelo.paralelo === paraleloDeseado.paralelo)?.docente ?? '';
  }

  getCupos(paraleloDeseado: HorarioMateria): number {
    return this.ofertaAcademicaSiaan[paraleloDeseado.sigla]?.paralelos!.find(paralelo => paralelo.paralelo === paraleloDeseado.paralelo)?.disponibles ?? -1;
  }

  cambiarHorarioNormal() {
    this.timeSlots = [
      '07:15 - 08:00', '08:00 - 08:45', '09:00 - 09:45', '09:45 - 10:30',
      '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',
      '14:15 - 15:00', '15:00 - 15:45', '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30',
      '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00'
    ];
    this.resetUserScheduleData();
  }

  cambiarHorarioMedicina() {
    this.timeSlots = [
      '07:15 - 08:45', '08:45 - 09:00', '09:00 - 09:30','09:30 - 09:45', '09:45 - 10:00',  '10:00 - 10:30',
      '10:45 - 11:30', '11:30 - 12:15', '12:30 - 13:15', '13:15 - 14:00',  '14:15 - 15:00', '15:00 - 15:45',
      '16:00 - 16:45', '16:45 - 17:30', '17:45 - 18:30', '18:30 - 19:15', '19:30 - 20:15', '20:15 - 21:00',
    ];
    this.resetUserScheduleData();
  }

  resetUserScheduleData() {
    this.userScheduleData = Array(this.timeSlots.length).fill(Array(6).fill(''));
  }

  range(start: number, end: number): number[] {
    let result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }
  requestGetOpciones(){
    this.horariosService.getOpciones(this.carrera.nombre, this.tipoHorario).subscribe(
      (data: number[]) => {
        this.opciones = data;
      },
      () => {
        // Handle login error
      }
    );
  }
  getOptions() {
    this.appendCarreraToUrl();
    this.tipoHorario = 'NUEVO';
    this.carrera.nombre === 'MEDICINA' ? this.cambiarHorarioMedicina() : this.cambiarHorarioNormal();
    this.opcion = undefined;
    this.requestGetOpciones()
  }
  getOptionsByTipo() {
    this.opcion = undefined;
    this.requestGetOpciones()
  }

  appendOpcionToUrl() {
    this.router.navigate([], {
      queryParams: { opcion: this.opcion! },
      queryParamsHandling: 'merge'
    });
  }

  appendCarreraToUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { carrera: this.carrera.nombre, opcion: null },
      queryParamsHandling: 'merge'
    });
  }

  removeOpcionFromUrl() {
    this.router.navigate([], {
      queryParams: { opcion: null },
      queryParamsHandling: 'merge'
    });
  }

  getHorario() {
    this.borrarHorario();
    this.horariosService.getOpcionHorario(this.carrera.nombre, this.opcion!).subscribe(
      (data: Horario) => {
        this.appendOpcionToUrl();
        this.horario = data;
        this.horario.horario.forEach(paralelo => {
          paralelo.docente = this.getDocente(paralelo);
          paralelo.cupos = this.getCupos(paralelo);
          this.fijarHorario(paralelo)
        });
      },
      () => {
        // Handle login error
      }
    );
  }

  separarHorario(horario: string): string[] {
    return horario.split(',').map(str => str.trimStart());
  }

  fijarHorario(paral: HorarioMateria): void {
    const horarioSeparado = this.separarHorario(paral.horario);
    for (let i = 0; i < horarioSeparado.length; i += 2) {
      const dia = this.days.indexOf(horarioSeparado[i]);
      const horas = this.getHoras(horarioSeparado[i + 1]);
      horas.forEach(hora => {
        const sigla = paral.paralelo.includes('-') ? `${paral.sigla} - ${paral.paralelo.split('-')[1]}` : paral.sigla!;
        this.userScheduleData[hora][dia] = sigla;
      });
    }
  }

  getHoras(horario: string): number[] {
    if (this.timeSlots.includes(horario)) {
      return [this.timeSlots.indexOf(horario)];
    } else {
      const [inicio, fin] = horario.split(' - ');
      const horas =  this.timeSlots
        .map((slot, index) => (slot.startsWith(inicio) || slot.endsWith(fin) ? index : -1))
        .filter(index => index !== -1);

      return this.range(horas[0], horas[1])
    }
  }

  openSnackBar() {
    this._snackBar.open('Por favor, seleccione otra carrera y nuevamente cambie a esta para actualizar correctamente los cupos', 'Aceptar', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  navigateToEditar() {
    this.setValueCarrera();
    this.router.navigate(['editarHorario', this.horario!._id]);
  }

  setValueCarrera() {
    this.carreraService.carrera = this.carrera;
  }

  deleteHorario() {
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      data: { mensaje: '¿Desea eliminar esta opción de horario?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOpcion();
        this.resetOpciones();
      }
    });
  }

  resetOpciones() {
    this.opciones = this.opciones.filter(o => o !== this.horario!.opcion);
    this.horario = undefined;
  }

  deleteOpcion() {
    this.horariosService
      .deleteHorario(this.horario!._id!)
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
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Se ha eliminado el horario correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }

  getDatosSiaan() {
    const carrera = this.carrera ?? "";//nombre
    this.ofertaSiaanService.getDatosSiaan(carrera).subscribe(
      {
        next: (result: HorarioMateria[]) => {
          this.paralelos = result.map(paralelo => ({ ...paralelo, sigla: paralelo.sigla.trim() }));
          if (this.paralelos.length === 0) {
            this.openSnackBar();
          }
          this.agruparCursos();
        },
        error: () => {
          // Handle login error
        }
      }
    );
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
    this.materias = Object.values(this.ofertaAcademicaSiaan);
  }

  borrarHorario() {
    this.userScheduleData = this.userScheduleData.map(row => row.map(() => ''));
  }

  openDialog(): void {
    this.dialog.open(ImpresionHorariosComponent, {
      data: { carrera: this.carrera.nombre },
      height: '98%',
      width: '55%'
    });
  }
}
