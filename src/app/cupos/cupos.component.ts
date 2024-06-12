import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HorarioMateria} from "../interfaces/horario-materia";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {Materia} from "../interfaces/materia";
import {LoaderService} from "../servicios/loader.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {startWith, switchMap} from "rxjs";

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-cupos',
  templateUrl: './cupos.component.html',
  styleUrls: ['./cupos.component.scss']
})
export class CuposComponent implements AfterViewInit{
  dataSource!: MatTableDataSource<HorarioMateria>;
  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  carrera = "";
  displayedColumns: string[] = ['sigla', 'materia', 'disponibles',"docente" , "horarios"];
  paralelos :HorarioMateria[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private ofertaSiaanService: OfertaSiaanService, public loaderService: LoaderService) {
    this.getParalelosMaterias()
  }

  ngAfterViewInit() {
    console.log(this.paginator)
    this.dataSource.paginator = this.paginator;
    console.log(this.sort)
    this.dataSource.sort = this.sort
  }
  getParalelosMaterias(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        this.paralelos = result
        this.dataSource = new MatTableDataSource(this.paralelos);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource.paginator)
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
