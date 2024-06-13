import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HorarioMateria} from "../interfaces/horario-materia";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {Materia} from "../interfaces/materia";
import {LoaderService} from "../servicios/loader.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {startWith, switchMap} from "rxjs";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {backgroundColor} from "html2canvas/dist/types/css/property-descriptors/background-color";
import {HorariosService} from "../servicios/horarios.service";
import {Horario} from "../interfaces/horario";


@Component({
  selector: 'app-cupos',
  templateUrl: './cupos.component.html',
  styleUrls: ['./cupos.component.scss',],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CuposComponent implements AfterViewInit{
  dataSource!: MatTableDataSource<HorarioMateria>;
  opciones: Horario[] = []
  carrera = "";
  displayedColumns: string[] = ['sigla', 'materia','paralelo',"docente" , "horarios", 'disponibles', 'opciones'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: HorarioMateria | null;
  paralelos :HorarioMateria[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private ofertaSiaanService: OfertaSiaanService, private horariosService: HorariosService, public loaderService: LoaderService) {
    //this.getParalelosMaterias()
    this.ObtenerTodasLasOpciones()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }
  getParalelosMaterias(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        this.paralelos = result
        this.dataSource = new MatTableDataSource(this.paralelos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'disponibles':
              if (item[property]! < 0) {
                return item[property]; // Negative values first
              } else if (item[property]! > 0) {
                return item[property]; // Positive values sorted directly
              } else {
                return 0; // Zero
              }
            default:
              return item[property];
          }
        };
        //this.agruparCursos()
        //console.log(this.opciones)
      },
      error => {
        console.error(error);
      }
    )
  }

  obtenerOpciones(sigla: string, paralelo: string){
    let opcionesConMateria : Horario[] = []
    this.opciones.map(horario =>{
      horario.horario.map(opcion =>{
        if(opcion.sigla == sigla && opcion.paralelo == paralelo){
          opcionesConMateria.push(horario)
        }
      })
    })
    return opcionesConMateria
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ObtenerTodasLasOpciones(){
    this.horariosService.getAllHorarios().subscribe(
      result => {
        this.opciones = result
        this.getParalelosMaterias()
      },
      error => {
        console.error(error);
      }
    )
  }

  protected readonly parseInt = parseInt;
}
/*


@Component({
  selector: 'table-overview-example',
  styleUrl: 'table-overview-example.css',
  templateUrl: 'table-overview-example.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class TableOverviewExample implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}
 */
