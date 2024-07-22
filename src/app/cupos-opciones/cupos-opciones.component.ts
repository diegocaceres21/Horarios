import { Component } from '@angular/core';
import {Horario} from "../interfaces/horario";
import {MatTableDataSource} from "@angular/material/table";
import {HorarioMateria} from "../interfaces/horario-materia";
import {CarreraOpciones} from "../interfaces/carrera-opciones";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {HorariosService} from "../servicios/horarios.service";
import {LoaderService} from "../servicios/loader.service";
import {CarreraService} from "../servicios/carrera.service";
import {Router} from "@angular/router";
import {Materia} from "../interfaces/materia";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cupos-opciones',
  templateUrl: './cupos-opciones.component.html',
  styleUrls: ['./cupos-opciones.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CuposOpcionesComponent {

  dataSource!: MatTableDataSource<Horario>;
  carrera: any
  carreraOpciones: CarreraOpciones[] = []
  displayedColumns: string[] = ['carrera', 'opcion', 'cupos',"materia", 'editar'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  paralelos :HorarioMateria[] = []
  opciones: Horario[] = []
  expandedElement!: Horario | null;

  constructor(private carreraService: CarreraService,private router: Router,public loaderService: LoaderService,private horariosService: HorariosService ,private ofertaSiaanService: OfertaSiaanService) {
    this.getHorariosOrdenadosPorCarrera()
  }
  getHorariosOrdenadosPorCarrera(){
    this.horariosService.getAllHorarios().subscribe(
      result =>{
        this.opciones = result
        this.getParalelosMaterias()

      },
      error => {
        console.error(error)
      }
    )
  }
  obtenerMenorCantidadDeCupos(horario: HorarioMateria[]){
    return horario.reduce((min, current) =>
      (current.disponibles ?? Infinity) < (min.disponibles ?? Infinity) ? current : min
    );
    //return horarioMinimo.disponibles
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
    this.opciones.map(opcion =>{
      opcion.horario.map(horario =>{
        horario.disponibles = this.getCupos(horario)
      })
    })
    this.dataSource = new MatTableDataSource(this.opciones);
  }
  getCupos(paraleloDeseado: HorarioMateria) : number{
    const cupos = this.paralelos.find((paralelo) => paralelo.sigla == paraleloDeseado.sigla && paralelo.paralelo == paraleloDeseado.paralelo)?.disponibles ?? -1;

    return cupos
  }

  filtrarPorCarrera(){
    console.log(this.carrera)
    if(this.carrera){
      this.dataSource.filter = this.carrera.nombre.trim().toLowerCase();
    }
    else{
      this.dataSource.filter = "".toLowerCase();
    }
  }
  getRowSpan(element: any, index: number) {
    const carrera = this.carreraOpciones.find(c => c.carrera === element.carrera);
    return carrera ? carrera.opciones?.length : 1;
  }
  irAPaginaDeEditarOpcion(_id: string){
    this.setValueCarrera()
    const baseHref = document.getElementsByTagName('base')[0].href;
    const url = this.router.serializeUrl(this.router.createUrlTree(['editarHorario', _id]));
    window.open(`${baseHref}${url}`, '_blank');
  }
  setValueCarrera() {
    this.carreraService.carrera = this.carrera;
  }

  protected readonly parseInt = parseInt;
}
