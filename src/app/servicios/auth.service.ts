import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "http://localhost:3000/horariosbackend/"

  constructor(private httpClient: HttpClient) { }

  loginGoogle(credential: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let body = {token: credential}
    return this.httpClient.post<any>(this.url + 'loginGoogle', body, { headers, observe: 'response'})
  }
  login(email: string, password:string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let dto = {email: email, password: password}
      return this.httpClient.post<any>(this.url + 'login', dto, { headers, observe: 'response', withCredentials: true  })
  }
}
