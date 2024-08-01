import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from 'rxjs';
import { RefreshService } from './refresh.service';
import {CookieService} from "ngx-cookie-service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private refreshService: RefreshService, private cookieService: CookieService) { }

  isLogged(): boolean{
    if(this.getToken()){
      return true;
    }
    return false;
  }

  setToken():void{
    const token = this.cookieService.get('token');
    console.log(token);
    this.cookieService.set('token', token);
    this.refreshService.refresh();

  }

  getToken(): string {

    return this.cookieService.get('token');
  }

  isExpired(): boolean {
    const helper = new JwtHelperService();
    // Check if the current date is before the token's expiration date
    return helper.isTokenExpired(this.getToken());
  }
  logout(): void{
    this.cookieService.set('token', '');
  }

}
