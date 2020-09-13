
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from './auth/shared/auth.service';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { LoginResponsePayload } from './auth/login/login.response.payload';


@Injectable({
    providedIn: 'root'
})
// To make sure that each request going to backend from angular client contains token(jwt) in http header
// This is achieved by HttpInterceptor. Concept of interceptor is imilar to servlet filter in java
// We will maintain logic to refresh token in this interceptor. If client send expired token to the server
// server reponse back with 403 error. At that time we ask for new token using refresh token.
// Use that access token for subsequesnt request.
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public authService: AuthService) { }

    // We retrieve token from local storage
    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        // Guard condition to skip the process if we  are making an API call to
        // Refresh token and login 
        if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
            return next.handle(req);
        }
        const jwtToken = this.authService.getJwtToken();

        // If token is valid, we set the token in authorization header using addToken(..) method
        if (jwtToken) {
            // If token which we are setting is invalid, we recive error response from backend, 
            // in that case we have to prepare our client to make refresh token call to the backend. 
            // Till we are making refresh token call, we have to temporarily block
            // all outgoing backend call for this user. Once we recieve new authentication token from backend, 
            // we are going to release all request again. We achieve this by isTokenRefreshing variable
            // and refreshTokenSubject variable, which in our case access the semaphore that block all outgoing call
            // The main reason to use BehaviorSubject instead of Subject or an Observable is that BehaviorSubject can have a value 
            // assigned to it, so when we receive new token from refresh token method, we can assign the token to BehaviorSubject
            // and access the new token inside the interceptor
            return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse
                    && error.status === 403) {
                    return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error);
                }
            }));
        }
        return next.handle(req);

    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        // We allow refresh token request only if there is not existing refresh token process going on
        // First request wins and request a refresh token
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponsePayload) => {
                    this.isTokenRefreshing = false;
                    // set token to BehaviorSubject, or else all outgoing call will be failing with the 403 error 
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req,
                        refreshTokenResponse.authenticationToken));
                })
            )
        } 
        // To avoid the second request to fail silently else block will be used.
        // We add filter on the behavioural subject until we receive non null response
        // And accept the first entry in the behavioural subject using take(1) method
        // and thenwe use switchMap(..) method to take the new token and use it to make request.
        else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.authService.getJwtToken()))
                })
            );
        }
    }

    // We are cloning the request and adding authorization header
    // We are cloning request because initial request object is immutable
    addToken(req: HttpRequest<any>, jwtToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + jwtToken)
        });
    }
}