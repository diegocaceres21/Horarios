import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HorarioComponent } from './horario/horario.component';
import { HttpClientModule } from  '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list'; // Import MatListModule
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatSelectModule} from '@angular/material/select';
import { NuevaMateriaComponent } from './modals/nueva-materia/nueva-materia.component';
import {MatInputModule} from '@angular/material/input'
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    AppComponent,
    HorarioComponent,
    NuevaMateriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
