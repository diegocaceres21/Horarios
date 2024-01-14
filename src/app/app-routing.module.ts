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
      { path: 'horarios/crearHorario', component: HorarioComponent, canActivate: [PaginasGuard] },
      { path: 'horarios/opciones', component: OpcionesHorariosComponent, canActivate: [PaginasGuard] },
      { path: 'horarios/login', component: LoginComponent, canActivate: [LoginGuard] }
    //]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
