import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Horario} from "../interfaces/horario";
import {Observable, tap} from "rxjs";
import {RefreshService} from "./refresh.service";
import {AuthService} from "./auth.service";
import {CookieService} from "ngx-cookie-service";
import {HorarioMateria} from "../interfaces/horario-materia";
import {CarreraOpciones} from "../interfaces/carrera-opciones";

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor( private cookieService: CookieService, private httpClient: HttpClient, private refreshService: RefreshService, private authService: AuthService) { }
  url = "http://localhost:3000/horariosbackend/horarios"
  getHorarios(carrera: string){
    return this.httpClient.get<Horario[]>(this.url + "?carrera=" + carrera, {withCredentials: true})
  }
  getAllHorarios(){
    return this.httpClient.get<Horario[]>(this.url + "/all", {withCredentials: true})
  }

  getAllHorariosByTipo(tipo: string){
    return this.httpClient.get<Horario[]>(this.url + "/PorTipo?tipo=" + tipo, {withCredentials: true})
  }
  deleteHorario(_id: string){
    return this.httpClient.delete(this.url + "/" + _id, {withCredentials: true})
  }
  getOpciones(carrera: string, tipo: string){
    return this.httpClient.get<number[]>(this.url + "/opciones?carrera=" + carrera + "&tipo=" + tipo, {withCredentials: true})
  }

  updateHorario(_id: string, horario: HorarioMateria[]){
    const updatePayload = { horario: horario };
    return this.httpClient.put<Horario>(this.url + "/" + _id, updatePayload, {withCredentials: true})
  }
  getHorarioById(_id:string){
    return this.httpClient.get<Horario>(this.url + "/" + _id, {withCredentials: true})
  }
  getOpcionHorario(carrera: string, opcion: number){
    return this.httpClient.get<Horario>(this.url + "/opciones/" + opcion +"?carrera=" + carrera, {withCredentials: true})
  }

  getHorariosAgrupadosPorCarrera(){
    return this.httpClient.get<CarreraOpciones[]>(this.url + "/grupo/carrera", {withCredentials: true})
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
