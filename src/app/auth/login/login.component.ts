import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login.request.payload';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  isError: boolean;
  registerSuccessMessage: string;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,  
              private activatedRoute: ActivatedRoute) { 
     // Initialization
     this.loginRequestPayload = {
      username: '',
      password: ''
    };

  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    // activatedRoute is used to access route parameter, which is coming in from signup component
    // We are subcribing to query params from activatedRoute object and in case we recive query parameter
    // with value 'registered' as true then we display "Signup Successful" notification message using toastr.success(..)
    // Next we are setting the vale for field registerSuccessMessage, we will access this in login.component.html file after 
    // successful registration
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;
    // subcribing to the response gettiing from authService.login
    this.authService.login(this.loginRequestPayload).subscribe(data => {
      //console.log("Login successfull");
      // In case of successful login, we navigate to root url and we are enabling success notification
      // with message 'Login Successful'
      if(data){
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastr.success('Login Successful');
      }
      // If we recive failure response from login call, we set isError=true
      else{
        this.isError = true;
      }
    });
  }
  

}
