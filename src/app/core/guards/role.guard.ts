import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getUserRole();
    // if (userRole == expectedRole) {
    //   console.log('role ok...')
    //   return true;
    // }

    // ตรวจสอบว่าผู้ใช้มี role ที่เหมาะสมหรือไม่
    if (expectedRole.some((role: string) => role === userRole)) {
      return true;
    }


    this.router.navigate(['/unauthorized']);
    return false;
  }
}
