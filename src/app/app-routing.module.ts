import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpcionesHorariosComponent } from './opciones-horarios/opciones-horarios.component';
import { HorarioComponent } from './horario/horario.component';
import {LoginComponent} from "./login/login.component";
import {PaginasGuard} from "./guards/paginas/paginas.guard";
import {LoginGuard} from "./guards/login/login.guard";
import {CuposComponent} from "./cupos/cupos.component";
import {ReportesComponent} from "./reportes/reportes.component";
import {CuposOpcionesComponent} from "./cupos-opciones/cupos-opciones.component";

const routes: Routes = [
  //{ path: 'horarios', children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'crearHorario', component: HorarioComponent, canActivate: [PaginasGuard] },
      { path: 'editarHorario/:_id', component: HorarioComponent, canActivate: [PaginasGuard] },
      { path: 'opciones', component: OpcionesHorariosComponent, canActivate: [PaginasGuard] },
      { path: 'cupos-materias', component: CuposComponent, canActivate: [PaginasGuard] },
      { path: 'cupos-opciones', component: CuposOpcionesComponent, canActivate: [PaginasGuard] },
      { path: 'reportes', component: ReportesComponent, canActivate: [PaginasGuard] },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }
    //]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
