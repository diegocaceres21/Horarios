import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Horario} from "../interfaces/horario";
import {Observable, tap} from "rxjs";
import {RefreshService} from "./refresh.service";
import {AuthService} from "./auth.service";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor( private cookieService: CookieService, private httpClient: HttpClient, private refreshService: RefreshService, private authService: AuthService) { }
  url = "http://localhost:3000/api/horarios"
  getHorarios(carrera: string){
    return this.httpClient.get<Horario[]>(this.url + "?carrera=" + carrera)
  }

  getOpciones(carrera: string){
    return this.httpClient.get<number[]>(this.url + "/opciones?carrera=" + carrera, {withCredentials: true})
  }

  getOpcionHorario(carrera: string, opcion: number){
    return this.httpClient.get<Horario>(this.url + "/opciones/" + opcion +"?carrera=" + carrera, {withCredentials: true})
  }
  crearHorario (horario: Horario) : Observable<Horario>{
    /*this.authService.login("test7@gmail.com", "test").subscribe(
      (response: any) => {
        const token = this.cookieService.get('token');
        console.log(token)
        this.cookieService.set('token', token);
      },
      (error) => {
        // Handle login error
      }
    )*////CAMBIAR URGENTE
    console.log(horario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Horario>(this.url, horario,{ headers, withCredentials: true}).pipe(
      tap(() => {
        this.refreshService.refresh();
      })
    );
  }
}
