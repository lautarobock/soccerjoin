import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Session } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private session: Session,
    private router: Router
  ) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const hasToken = this.session.token() !== undefined;
    if (!hasToken) {
      this.router.navigate(['/login']);
    }
    return hasToken;
  }
}
