import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiaanServiceService {
  token: string = "7cqR63L42tXntrPerVEAtfqCYhXV38aX9RDTsX9h0YzXw+eLQng2WUPKAGGkba38Va8HwMqNdWc+NJgvuaSeuCAFZmoEGg6LhwXw3wUlLuQ="
  uniquecode = "F3EJkUVwiOCjIIp"
  idPeriodoAcademico = "pi4GKbnZgpyzG0Lf%25252bppwgw=="

  constructor(private httpClient: HttpClient) { }

  getDatos(carreraId: string){
    let url = "https://backend.ucb.edu.bo/Academico/api/v1/Academico/Procesos/OfertaDeMaterias/ObtenerListaOfertaDeMaterias?idCarrera=" + carreraId + "&idPeriodoAcademico=" + this.idPeriodoAcademico + "&tamanoDePagina=200"; // Replace with the actual URL of your HTTP GET endpoint
    //Logger.log(url)
    let headers = {
      'Token': this.token,
      'Uniquecode': this.uniquecode
    };
  
    let options = {
      'headers': headers
    };
  
    return this.httpClient.get(url, options);
    
  }

  
}
