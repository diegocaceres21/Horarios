import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "https://cba.ucb.edu.bo/horariosbackend/"

  constructor(private httpClient: HttpClient) { }

  login(email: string, password:string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let dto = {email: email, password: password}
      return this.httpClient.post<any>(this.url + 'login', dto, { headers, observe: 'response', withCredentials: true  })
  }
}
