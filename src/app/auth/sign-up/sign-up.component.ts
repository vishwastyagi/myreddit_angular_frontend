import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  signupRequestPayload: SignupRequestPayload;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { 
    // Initialization
    this.signupRequestPayload = {
      username: '',
      password: '',
      email: ''
    };
  }

  ngOnInit() {
   /* this.signupForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null)
    });*/
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  signup(){
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;
    
    // signup method return Observable, we subscribe to this return type and log the response
    /*this.authService.signup(this.signupRequestPayload).subscribe(data=>{
      console.log(data);
    });*/

    this.authService.signup(this.signupRequestPayload) .subscribe(data => {
      // we are using queryParams: { registered: 'true' } to tell login component that registration is successful
      this.router.navigate(['/login'],
        { queryParams: { registered: 'true' } });
    }, error => {
      // In case of error, we want to show error notification
      console.log(error);
      this.toastr.error('Registration Failed! Please try again');
    });
  }
}