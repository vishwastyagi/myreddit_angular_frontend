import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';

@Injectable({
  providedIn: 'root'
})
// Protects secure routes in our angular application. Some of the routes in our application should only be 
// accessible only if user is logged in. To achieve this we have guard in Angular, which tells Router whether 
// to allow navigation to a route or not. Here we use CanActivate guard.
// use command "ng g guard auth/auth" or "ng g guard auth CanActivate" to generate guard file

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // If user is logged in the return true else return redirect to login page
      const isAuthenticated = this.authService.isLoggedIn();
      if(isAuthenticated){
        return true;
      } else{
        this.router.navigateByUrl('/login');
      }
      return true;
  }
   
  
}
