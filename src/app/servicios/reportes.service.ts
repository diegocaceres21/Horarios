import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RefreshService} from "./refresh.service";
import {AuthService} from "./auth.service";
import {Horario} from "../interfaces/horario";
import {HorarioMateria} from "../interfaces/horario-materia";
import {Observable, tap} from "rxjs";
import {Reporte} from "../interfaces/reporte";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor( private cookieService: CookieService, private httpClient: HttpClient, private refreshService: RefreshService, private authService: AuthService) { }
  url = "http://localhost:3000/horariosbackend/reportes"
  getReportes(){
    return this.httpClient.get<Reporte[]>(this.url + '/all', {withCredentials: true})
  }
  deleteReporte(_id: string){
    return this.httpClient.delete(this.url + "/" + _id, {withCredentials: true})
  }
  updateReporte(_id: string, reporte: Reporte){
    const updatePayload = { horario: reporte };
    return this.httpClient.put<Reporte>(this.url + "/" + _id, updatePayload, {withCredentials: true})
  }
  getReporteById(_id:string){
    return this.httpClient.get<Reporte>(this.url + "/" + _id, {withCredentials: true})
  }

  crearReporte (reporte: Reporte) : Observable<Reporte>{
    console.log(reporte);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Reporte>(this.url, reporte,{ headers, withCredentials: true}).pipe(
      tap(() => {
        this.refreshService.refresh();
      })
    );
  }
}
