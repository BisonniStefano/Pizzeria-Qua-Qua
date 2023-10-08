import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AlreadyLoggedGuard {

  constructor(
    public router: Router,
    public authService: AuthService
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if(this.authService.isLoggedIn)this.router.navigate(['access-denied']);
    return true;
  }
}