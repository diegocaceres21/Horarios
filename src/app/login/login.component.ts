import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../servicios/auth.service";
import {from, take} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {TokenService} from "../servicios/token.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  passwordType : string = 'password';
  public loginValid = true;
  public email = '';
  public password = '';
  private ngZone!: NgZone


  constructor(private _snackBar: MatSnackBar,private tokenService:TokenService ,private authService: AuthService, private router: Router, private cookieService: CookieService) {

  }
  ngOnInit(): void {
    this.establecerId()
    // Asegúrate de que la función manejarRespuestOAuth esté disponible en el ámbito global
    window.addEventListener('message', (event) => {
      if (event.origin === 'http://localhost:3000') { // Asegúrate de que el origen sea tu backend
        this.manejarRespuestOAuth(event.data);
      }
    });
    //(window as any).manejarRespuestOAuth = this.manejarRespuestOAuth.bind(this);
  }

  decodeJWTToken(token){
    return JSON.parse(atob(token.split(".")[1]))
  }
  manejarRespuestOAuth(response: any){
    console.log(response)
    this.router.navigate(['opciones']);
    //this.loginGoogleRequest(response.credential)
    //sessionStorage.setItem('loggedinUser',JSON.stringify(responsePayload))
    //window.location('/your-desired-place')
  }

  mostrarSnackBarError(){
    this._snackBar.open("Ha ocurrido un error al iniciar sesión. Intentelo nuevamente.", "Cerrar", {duration: 3000});
  }

  establecerId() {
    localStorage.getItem("uniquecodeadm") || localStorage.setItem("uniquecodeadm", this.generarCadenaAleatoria())
  }

  generarCadenaAleatoria() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let t = "";
    for (let o = 0; o < 15; o++)
      t += e.charAt(Math.floor(Math.random() * e.length));
    return t
  }
  loginGoogleRequest(credential){
    this.authService.loginGoogle(credential).pipe(take(10)).subscribe(
      (response: any) => {
        console.log(response)
        this.router.navigate(['opciones']);
      },
      (error) => {
        this.mostrarSnackBarError()   // Handle login error
      }
    )
  }
  loginRequest(){
    this.authService.login(this.email, this.password).pipe(
      take(1)
    ).subscribe(
      (response: any) => {
        this.tokenService.setToken()
        this.router.navigate(['opciones']);
      },
      (error) => {
        this.loginValid = false
      }
    )
  }
  public onSubmit(): void {
    this.loginValid = true;

    this.loginRequest()
  }
}
