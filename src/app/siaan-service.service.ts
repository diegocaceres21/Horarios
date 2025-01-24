import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiaanServiceService {
  token: string = ""
  uniquecode = "F3EJkUVwiOCjIIp"
  idPeriodoAcademico = "zYDmWvkm28DPTATEijmGZw=="
  idCarrera = ""

  constructor(private httpClient: HttpClient) { }

  createUrl(carreraId: string, idPeriodo: string) : string{
    return "https://backend.ucb.edu.bo/Academico/api/v1/Academico/Procesos/OfertaDeMaterias/ObtenerListaOfertaDeMaterias?idCarrera=" + carreraId + "&idPeriodoAcademico=" + idPeriodo + "&tamanoDePagina=200"; // Replace with the actual URL of your HTTP GET endpoint
  }


  getIdEstudiante(carnet: string){

  }

  getDatosEstudiante(idEstudiante: string){

  }
  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  private updateToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }

}
