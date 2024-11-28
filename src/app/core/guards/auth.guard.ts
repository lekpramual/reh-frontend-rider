import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { JwtEncodeService } from '@core/services/jwt-encode.service';
import { environment } from '@env/environment';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService:AuthService,
    private jwtEncodeService: JwtEncodeService
  ) {}

  canActivate(): boolean {
    const accessToken = environment.ACCESS_TOKENS;
    const b64Token = localStorage.getItem(accessToken);

    if (!b64Token) {
      this.authService.logout();
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }

    return true;
  }


}

