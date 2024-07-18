import {Component, OnInit} from '@angular/core';
import {Reporte} from "../interfaces/reporte";
import {ReportesService} from "../servicios/reportes.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit{

  reportes: Reporte[] = []
  reporteSeleccionado?: Reporte;
  urlReporteActual?: string;
  sanitizedUrl!: SafeResourceUrl;

  constructor(private reportesService: ReportesService, private sanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.getReportes()
  }

  mostrarReporte(){

    if (this.reporteSeleccionado && this.reporteSeleccionado.url) {
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reporteSeleccionado.url);
    }
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
