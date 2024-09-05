import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem(environment.LOGIN_STATUS) === 'ok';

    console.log(isAuthenticated);
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }
    return true;
  }
}
