import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TokenService} from "../../servicios/token.service";

@Injectable({
  providedIn: 'root'
})
export class PaginasGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(!this.tokenService.isLogged() || this.tokenService.isExpired()){
        this.router.navigate(['login']);
        return false;
    }
    return true;
  }
}
