import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HorarioComponent } from './horario/horario.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from  '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'; // Import MatListModule
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatSelectModule} from '@angular/material/select';
import { NuevaMateriaComponent } from './modals/nueva-materia/nueva-materia.component';
import {MatInputModule} from '@angular/material/input'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { InterceptorService } from './servicios/interceptor.service';
import { OpcionesHorariosComponent } from './opciones-horarios/opciones-horarios.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {RightClickToDeleteDirective} from './right-click.directive';
import { NuevoHorarioConfirmarComponent } from './modals/nuevo-horario-confirmar/nuevo-horario-confirmar.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login/login.component';
import { ConfirmarComponent } from './modals/confirmar/confirmar.component';
import { ImpresionHorariosComponent } from './impresion-horarios/impresion-horarios.component';
import {SelectorCarreraComponent} from "./componentes/selector-carrera/selector-carrera.component";
import { CuposComponent } from './cupos/cupos.component';
import { ReportesComponent } from './reportes/reportes.component';
import {MatSortModule} from "@angular/material/sort";
import { CuposOpcionesComponent } from './cupos-opciones/cupos-opciones.component';
import { TablaParalelosComponent } from './componentes/tabla-paralelos/tabla-paralelos.component';
import { SimuladorPagosComponent } from './simulador-pagos/simulador-pagos.component';
import { TablaDetallePagosComponent } from './componentes/tabla-detalle-pagos/tabla-detalle-pagos.component';
import { TablaPlanPagoComponent } from './componentes/tabla-plan-pago/tabla-plan-pago.component';
import { NumberFormatPipe } from './number-format.pipe';
import { GeneradorDocumentosComponent } from './generador-documentos/generador-documentos.component';

//import { SelectorCarreraComponent } from './componentes/selector-carrera/selector-carrera.component';


@NgModule({
  declarations: [
    AppComponent,
    HorarioComponent,
    NuevaMateriaComponent,
    OpcionesHorariosComponent,
    RightClickToDeleteDirective,
    NuevoHorarioConfirmarComponent,
    LoginComponent,
    ConfirmarComponent,
    ImpresionHorariosComponent,
    SelectorCarreraComponent,
    CuposComponent,
    ReportesComponent,
    CuposOpcionesComponent,
    TablaParalelosComponent,
    SimuladorPagosComponent,
    TablaDetallePagosComponent,
    TablaPlanPagoComponent,
    NumberFormatPipe,
    GeneradorDocumentosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatSortModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  providers: [CookieService,
    { provide: HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
