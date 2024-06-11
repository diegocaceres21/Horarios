import { Component } from '@angular/core';
import {HorarioMateria} from "../interfaces/horario-materia";
import {OfertaSiaanService} from "../servicios/oferta-siaan.service";
import {Materia} from "../interfaces/materia";

@Component({
  selector: 'app-cupos',
  templateUrl: './cupos.component.html',
  styleUrls: ['./cupos.component.scss']
})
export class CuposComponent {
  ofertaAcademicaSiaan: { [clave: string]: Materia } = {};
  carrera = "";
  displayedColumns: string[] = ['sigla', 'materia', 'paralelo',"docente" , "horarios", "cupos"];
  clickedRows = new Set<HorarioMateria>();
  paralelos :HorarioMateria[] = []

  constructor(private ofertaSiaanService: OfertaSiaanService) {
    this.getParalelosMaterias()
  }
  getParalelosMaterias(){
    this.ofertaSiaanService.getDatosSiaan(this.carrera).subscribe(
      result => {
        this.paralelos = result
        //this.agruparCursos()
      },
      error => {
        console.error(error);
      }
    )
  }
  agruparCursos() {

    this.paralelos.forEach(curso => {
      const clave = curso.sigla!;
      if (!this.ofertaAcademicaSiaan[clave]) {
        this.ofertaAcademicaSiaan[clave] = {
          sigla: curso.sigla!,
          asignatura: curso.materia!,
          paralelos: []
        };
      }
      this.ofertaAcademicaSiaan[clave].paralelos!.push(curso);
    });
  }

}
