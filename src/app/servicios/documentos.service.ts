import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  url = "http://localhost:3000/horariosbackend/documentos"
  constructor(private http: HttpClient) { }

  // Method to fetch the document from the backend
  obtenerCartaDeTraspaso(userId: string) {
    // Set responseType to 'blob' to handle binary data
    const payload = { nombre_completo: "Diego Isaias Caceres Cortez", carnet: "E-10268053", universidad: "UNIFRANZ", carrera: "Derecho" };
    return this.http.post( this.url + "/obtenerCartaDeTraspasoFormatoWord" , payload, { responseType: 'blob', withCredentials: true });
  }

  obtenerDocumentosEntregados(payload){
    return this.http.post( this.url + "/obtenerDocumentosEntregadosFormatoWord" , payload, { responseType: 'blob', withCredentials: true });
  }
}
