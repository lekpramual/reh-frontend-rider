import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from local storage or a service
    const token = localStorage.getItem(environment.LOGIN_TOKENS);

    // Clone the request and add the authorization header
    // Clone the request to add the authorization header if token is available
    let clonedRequest = req;

    if (token) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    // const authReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${authToken}`
    //   }
    // });

    // Pass the cloned request instead of the original request to the next handler
    // return next.handle(authReq);

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token is expired or invalid, show an alert message
          alert('Your session has expired. Please log in again.');
          // Optionally, redirect to the login page
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}

