import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { Router } from '@angular/router';
import { PostModel } from '../shared/post.model';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;
  posts: Array<PostModel> = [];

  constructor(private authService: AuthService, private router: Router) { }

  

  ngOnInit(): void {
    //this.isLoggedIn = this.authService.isLoggedIn();
    //this.username = this.authService.getUserName();

    // Subscribe the two fields in header component fro auth service
    // Auth service emits these values to the header component
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);

    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
  }

  goToUserProfile() {
    this.router.navigateByUrl('/user-profile/' + this.username);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('');
  }

}
