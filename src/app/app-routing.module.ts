import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpcionesHorariosComponent } from './opciones-horarios/opciones-horarios.component';
import { HorarioComponent } from './horario/horario.component';

const routes: Routes = [{ path: 'crearHorario', component: HorarioComponent }, { path: 'opciones', component: OpcionesHorariosComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
