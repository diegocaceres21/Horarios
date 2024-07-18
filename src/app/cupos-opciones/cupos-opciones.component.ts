import { Component } from '@angular/core';
import {Horario} from "../interfaces/horario";
import {MatTableDataSource} from "@angular/material/table";
import {HorarioMateria} from "../interfaces/horario-materia";
import {CarreraOpciones} from "../interfaces/carrera-opciones";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {HorariosService} from "../servicios/horarios.service";
import {LoaderService} from "../servicios/loader.service";

@Component({
  selector: 'app-cupos-opciones',
  templateUrl: './cupos-opciones.component.html',
  styleUrls: ['./cupos-opciones.component.scss']
})
export class CuposOpcionesComponent {

  dataSource!: MatTableDataSource<CarreraOpciones>;
  carrera: string = ""
  carreraOpciones: CarreraOpciones[] = []
  displayedColumns: string[] = ['carrera', 'opcion'];
  paralelos :HorarioMateria[] = []
  constructor(public loaderService: LoaderService,private horariosService: HorariosService ,private ofertaSiaanService: OfertaSiaanService) {
    this.getOpcionesAgrupadasPorCarrera()
  }

  getOpcionesAgrupadasPorCarrera(){
    this.horariosService.getHorariosAgrupadosPorCarrera().subscribe(
      result =>{
        this.carreraOpciones = result;
        this.dataSource = new MatTableDataSource(result);
        console.log(this.dataSource)
      },
      error => {
        console.error(error);
      }
    )
  }
  getParalelosMaterias(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        this.paralelos = result
        this.paralelos.map(paralelo =>{
          this.obtenerCuposMaterias()
        })

      },
      error => {
        console.error(error);
      }
    )
  }

  obtenerCuposMaterias(){

  }
  filtrarPorCarrera(){

  }
  getRowSpan(element: any, index: number) {
    const carrera = this.carreraOpciones.find(c => c.carrera === element.carrera);
    return carrera ? carrera.opciones?.length : 1;
  }

  protected readonly parseInt = parseInt;
}
