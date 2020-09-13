import { Component, OnInit } from '@angular/core';
import { SubredditService } from 'src/app/subreddit/subreddit.service';
import { SubredditModel } from 'src/app/subreddit/subreddit.response';

@Component({
  selector: 'app-subreddit-side-bar',
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css']
})
export class SubredditSideBarComponent implements OnInit {
  subreddits: Array<SubredditModel>;
  displayViewAll: boolean;

  constructor(private subredditService : SubredditService) { 
    this.subredditService.getAllSubreddits().subscribe(data=> {
      // list of subreddits can be huge, we can face problem while redering the subreddits
      // We create View All button, if the subreddits is greater than 4 then show View All button
      // This button will open a new page with all subreddits. displayViewAll variable will control
      // the visibility of View All button.
      if(data.length >= 4){
        this.subreddits=data.splice(0,3);
        this.displayViewAll = true;
      }else{
        this.subreddits=data;
      }

    });
  }

  ngOnInit(): void {
  }

}
