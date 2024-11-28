import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class SiaanService {
  private apiUrl = `http://localhost:3000/horariosbackend/siaan/`;

  constructor(
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  loginSiaan(payload: any): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.apiUrl + 'logIn', payload, { observe: 'response', withCredentials: true }).pipe(
      catchError(this.createHandleError(true))
    );
  }

  obtenerOfertaAcademicaSiaanPorCarrera(carreraId: string, idPeriodo: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Token': this.tokenService.getTokenSiaan(),
      'Uniquecode': this.tokenService.getUniqueCode()
    });

    return this.httpClient.get<any[]>(`${this.apiUrl}obtenerAsignaturasPorCarrera?carreraId=${carreraId}&idPeriodo=${idPeriodo}`, { headers }).pipe(
      catchError(this.createHandleError(false))
    );
  }

  obtenerTiposDePrograma(idRegional: string, idPeriodoAcademico: string): Observable<any> {
    const headers = new HttpHeaders({
      'Token': this.tokenService.getTokenSiaan(),
      'Uniquecode': this.tokenService.getUniqueCode()
    });

    return this.httpClient.get<any[]>(`${this.apiUrl}obtenerTiposDePrograma?idRegional=${idRegional}&idPeriodoAcademico=${idPeriodoAcademico}`, { headers }).pipe(
      catchError(this.createHandleError(true))
    );
  }

  obtenerSedePersona(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Token': this.tokenService.getTokenSiaan(),
      'Uniquecode': this.tokenService.getUniqueCode()
    });

    return this.httpClient.get<any[]>(`${this.apiUrl}obtenerSedePersona`, { headers }).pipe(
      catchError(this.createHandleError(true))
    );
  }

  obtenerIdCarrerasDepartamento(idRegional: string, idPeriodoAcademico: string, idTipo: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Token': this.tokenService.getTokenSiaan(),
      'Uniquecode': this.tokenService.getUniqueCode()
    });

    return this.httpClient.get<any[]>(`${this.apiUrl}obtenerIdCarrerasDepartamento?idRegional=${idRegional}&idPeriodoAcademico=${idPeriodoAcademico}&idTipo=${idTipo}`, { headers }).pipe(
      catchError(this.createHandleError(false))
    );
  }

  private createHandleError(showSnackBar: boolean) {
    return (error: HttpErrorResponse) => this.handleError(error, showSnackBar);
  }

  private handleError(error: HttpErrorResponse, showSnackBar: boolean = true): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `${error.error.message}`;
    }
    if (showSnackBar) {
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    }
    return throwError(errorMessage);
  }
}
