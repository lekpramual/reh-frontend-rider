import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { JwtEncodeService } from '@core/services/jwt-encode.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtEncodeService: JwtEncodeService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = environment.ACCESS_TOKENS;
    // Get the auth token from local storage or a service
    const token = localStorage.getItem(accessToken) || '';
    // Decode Token
    const decodeToken = this.jwtEncodeService.decode(token);
    // Clone the request and add the authorization header
    // Clone the request to add the authorization header if token is available
    let clonedRequest = req;
    if (decodeToken) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${decodeToken}`)
      });
    }
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Token is expired >>>');
          this.authService.logout();
          // Token is expired or invalid, show an alert message
          // alert('Your session has expired. Please log in again.');
          // Optionally, redirect to the login page
          this.router.navigate(['/login']);
        }
        return throwError(() => error);;
      })
    );
  }
}


