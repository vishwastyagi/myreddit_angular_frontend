import { Injectable, Output, EventEmitter  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SignupRequestPayload } from '../sign-up/signup-request.payload'
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponsePayload } from '../login/login.response.payload';


import {Observable, throwError} from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // These two fields are used in header component
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();


  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor(private httpClient:HttpClient, private localStorage: LocalStorageService) { }

  signup(signupRequestPayload: SignupRequestPayload) : Observable<any>{
    // return type of http rest call is string we will convert string to text using  {responseType: 'text'}
    return this.httpClient.post('http://localhost:8080/api/auth/signup',signupRequestPayload, {responseType: 'text'});
  }

  login(loginRequestPayload: LoginRequestPayload) : Observable<boolean>{
    // Here we get object as return type from rest call, use pipe and map method from rxjs to map response
    return this.httpClient.post<LoginResponsePayload>('http://localhost:8080/api/auth/login',
      loginRequestPayload).pipe(map(data => {
         // Here we can access fields which is part of response
        // Here we will store details in browser local storage. For that we need to add dependecy
        // to our project "ngx-webstorage": "5.0.0" in package.json
        // run "npm install" or "npm install --save ngx-webstorage" after that.

        // store() takes key and value
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);

        this.loggedIn.emit(true);
        this.username.emit(data.username);
        return true;

        return true;
      }));
  }

  // retieve token from local storage and return it
  getJwtToken(){
    return this.localStorage.retrieve('authenticationToken');
  
  }

  // for the post call we receive object from backend 
  refreshToken() {
    return this.httpClient.post<LoginResponsePayload>('http://localhost:8080/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        // stores received value from local storage
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  isLoggedIn(): boolean {
    // check if token exist in local storage
    return this.getJwtToken() != null;
  }

  logout(){
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
    { responseType: 'text' })
    .subscribe(data => {
      console.log(data);
    }, error => {
      throwError(error);
    });
    // clear all the details
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
  }

}
