import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiaanServiceService {
  token: string = ""
  uniquecode = "F3EJkUVwiOCjIIp"
  idPeriodoAcademico = "8RzubTahb3U78UzxLRQHUQ=="
  idCarrera = ""

  constructor(private httpClient: HttpClient) { }

  getDatos(carreraId: string){
    this.idCarrera = carreraId;
    this.token = this.getTokenFromLocalStorage()!
    console.log(this.token)
    let url = "https://backend.ucb.edu.bo/Academico/api/v1/Academico/Procesos/OfertaDeMaterias/ObtenerListaOfertaDeMaterias?idCarrera=" + carreraId + "&idPeriodoAcademico=" + this.idPeriodoAcademico + "&tamanoDePagina=200"; // Replace with the actual URL of your HTTP GET endpoint
    //Logger.log(url)
    let headers = {
      'Token': this.token,
      'Uniquecode': this.uniquecode
    };

    let options = {
      'headers': headers
    };
    return this.httpClient.get<any>(url,options).pipe(
      catchError(this.handleError.bind(this)));

  }

  private handleError() {
    this.login()
    let errorMessage = 'An error occurred';

    /*if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }*/

    console.error(errorMessage);

    return throwError(errorMessage);
  }

  private login() {
    const url = 'https://backend.ucb.edu.bo/Authentication/api/v1/Authentication/LogInEmail'; // Replace with the actual URL of the API endpoint
    let payload = {
      "Email": "diego.caceres@ucb.edu.bo",
      "Id": "100960155175971330902",
      "Name": "DIEGO ISAIAS CACERES CORTEZ",
      "PhotoUrl": "https://lh3.googleusercontent.com/a/AAcHTtdYyHPFW306FbjXtNL8Lg2RBr0qBI-T8_EDtrssKGQGG6M=s96-c",
      "FirstName": "DIEGO ISAIAS",
      "LastName": "CACERES CORTEZ",
      "AuthToken": "ya29.a0AbVbY6MH3JPhbumgnYTqx8m6-k0hMVvXkZkTEBwa4SQu91FBAQzCpV0UqN17swHTpBBZiKhLPh7gp2IBcnj4a1R-TFMCFCQ0K87E-ba20D6INPEBBdTbYlFPZI-zxTlDNOzBQqcTXQjw6qfMZ_SmJma3bGt-eTMaCgYKAQYSARMSFQFWKvPlAJnB8G8R8IkMw6cC4bL8uw0166",
      "IdToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzYmRiZmRlZGUzYmFiYjI2NTFhZmNhMjY3OGRkZThjMGIzNWRmNzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjgxNDMzNTA3MDQ1LTV2MjhzMGgzZnZsdWY5Y3ZiNWo3Z3Fla2pnYXVsYnRzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjgxNDMzNTA3MDQ1LTV2MjhzMGgzZnZsdWY5Y3ZiNWo3Z3Fla2pnYXVsYnRzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAwOTYwMTU1MTc1OTcxMzMwOTAyIiwiaGQiOiJ1Y2IuZWR1LmJvIiwiZW1haWwiOiJkaWVnby5jYWNlcmVzQHVjYi5lZHUuYm8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImdTTms0S0F6TDg1aFRkczQ2SDd1RkEiLCJuYmYiOjE2OTAzMjkwNDIsIm5hbWUiOiJESUVHTyBJU0FJQVMgQ0FDRVJFUyBDT1JURVoiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZFl5SFBGVzMwNkZialh0Tkw4TGcyUkJyMHFCSS1UOF9FRHRyc3NLR1FHRzZNPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRJRUdPIElTQUlBUyIsImZhbWlseV9uYW1lIjoiQ0FDRVJFUyBDT1JURVoiLCJsb2NhbGUiOiJlcy00MTkiLCJpYXQiOjE2OTAzMjkzNDIsImV4cCI6MTY5MDMzMjk0MiwianRpIjoiMGYxYjM2ZTYwYjU2YWE3M2IwODdiMTYxODBjNTk0YzAyNzNmMGY5OCJ9.XCbM9r9bfoJH497vIOHeE8pMtYrt4qkKyqoMZou9eIgSRoke3MNhK-g2QIQI_uji0d7KtuOOtx4mBFX4JSnRwmhA-3yrtT_J3Sk4KoGCSQ6Rt5Gjk_U8TI2DsWjoPT28AUm1OrBYIrkvNKu60XhpNdmIuitBQIYXUpcevFyzgpNe2eWxwHKr-zn0yqddYn4wFZsiKq6pK8ySPjjdor8ZvO_b22XEfs4NUxMqChKjEhCTOSxQE-MFa003VfxG1FDkShX7xmgl0NnHrroyT8sfPMNn0cFIEiCKQ6nS5RZ53SzcwsGhmBuYBT8VUESz-LhlGeNAMoABcuCdPCqjI82MjQ",
      "UniqueCode": "F3EJkUVwiOCjIIp",
      "ServiceCode": "1"
  }

    this.httpClient.post(url,payload, { observe: 'response' }).subscribe(
      (response) => {
        // Check if the request was successful (status code 200)
          const tokenHeaderValue = response.headers.get('token');
          this.updateToken(tokenHeaderValue!);
          //console.log(this.token)
          //this.getDatos(this.idCarrera)

      },
      (error) => {
        console.log('Error occurred:', error);
      }
    );
    //console.log("login")
  }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  private updateToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }

}
