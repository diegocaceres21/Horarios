import {Component, OnInit} from '@angular/core';
import {Reporte} from "../interfaces/reporte";
import {ReportesService} from "../servicios/reportes.service";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit{

  reportes: Reporte[] = []
  reporteSeleccionado?: Reporte;
  urlReporteActual?: string;

  constructor(private reportesService: ReportesService) {

  }
  ngOnInit() {
    this.getReportes()
  }

  mostrarReporte(){

    this.urlReporteActual = this.reporteSeleccionado?.url
    console.log(this.urlReporteActual)
  }
  getReportes(){
    this.reportesService.getReportes().subscribe(
      datos =>{
        this.reportes = datos
      },
      error => {
        console.log(error)
      }
    )
  }
}
