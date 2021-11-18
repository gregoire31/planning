import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const token: string | null = localStorage.getItem('token');
    req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    return next.handle(req)
        .pipe(
           catchError((error: HttpErrorResponse) => {
                const token = localStorage.getItem('token');
                if (error && error.status === 401 && token) {
                  this.toastr.error('Token expiré')
                  this.authService.logOut()
                }
                const err = error.error.message || error.statusText;
                return throwError(error);
           })
        );
  }
}
