import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private authService:AuthService) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem(environment.LOGIN_STATUS) === 'ok';


    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }
    return true;
  }
}
