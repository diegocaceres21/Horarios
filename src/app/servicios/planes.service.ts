import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Materia } from '../interfaces/materia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  constructor(private httpClient: HttpClient) { }
  getDatos(){
    return this.httpClient.get<any>("assets/IFI.json")
  }
}
