import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import {TokenService} from "../../servicios/token.service";

@Injectable({
  providedIn:'root'
})

export class LoginGuard implements CanActivate{
  constructor(private tokenService: TokenService, private router: Router){}

  canActivate(next: ActivatedRouteSnapshot, state:RouterStateSnapshot) : boolean{
    if( this.tokenService.isLogged()){
      if(!this.tokenService.isExpired()){
        this.router.navigate(['opciones']);
        return false;
      }
      return true;
    }
    return true;
  }
}
