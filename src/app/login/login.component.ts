import { Component } from '@angular/core';
import {AuthService} from "../servicios/auth.service";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {TokenService} from "../servicios/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordType : string = 'password';
  public loginValid = true;
  public email = '';
  public password = '';

  constructor(private tokenService:TokenService ,private authService: AuthService, private router: Router, private cookieService: CookieService) {

  }
  public onSubmit(): void {
    this.loginValid = true;

    this.authService.login(this.email, this.password).pipe(
      take(1)
    ).subscribe(
      (response: any) => {
        this.tokenService.setToken()
        this.router.navigate(['opciones']);
      },
      (error) => {
        this.loginValid = false   // Handle login error
      }
    )
  }
}
