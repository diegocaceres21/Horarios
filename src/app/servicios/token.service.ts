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
    this.cookieService.set('token', token);
    this.refreshService.refresh();
  }

  setTokenSiaan(): void {
    const token = this.cookieService.get('token_ucb');
    console.log("Token Siaan" + token);
    this.cookieService.set('token_ucb', token);
    this.refreshService.refresh();
  }

  getTokenSiaan(){
    return this.cookieService.get('token_ucb');
  }

  getToken(): string {
    return this.cookieService.get('token');
  }


  setUniqueCode(uniqueCode: string) {
    localStorage.setItem('uniquecodeadm', uniqueCode);
    this.refreshService.refresh();
  }

  getUniqueCode(): string {
    return localStorage.getItem('uniquecodeadm') || '';
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
