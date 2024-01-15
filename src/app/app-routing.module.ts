import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpcionesHorariosComponent } from './opciones-horarios/opciones-horarios.component';
import { HorarioComponent } from './horario/horario.component';
import {LoginComponent} from "./login/login.component";
import {PaginasGuard} from "./guards/paginas/paginas.guard";
import {LoginGuard} from "./guards/login/login.guard";

const routes: Routes = [
  //{ path: 'horarios', children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'crearHorario', component: HorarioComponent, canActivate: [PaginasGuard] },
      { path: 'editarHorario/:_id', component: HorarioComponent, canActivate: [PaginasGuard] },
      { path: 'opciones', component: OpcionesHorariosComponent, canActivate: [PaginasGuard] },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }
    //]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
