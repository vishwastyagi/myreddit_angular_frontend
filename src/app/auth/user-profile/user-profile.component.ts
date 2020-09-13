import { Component, OnInit } from '@angular/core';
import { PostModel } from 'src/app/shared/post.model';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { PostService } from 'src/app/shared/post.service';
import { CommentService } from 'src/app/comment/comment.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  name: string;
  posts: PostModel[];
  comments: CommentPayload[];
  postLength: number;
  commentLength: number;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService,
    private commentService: CommentService) {
      // Reading username from query params
    this.name = this.activatedRoute.snapshot.params.name;

    this.postService.getAllPostsByUser(this.name).subscribe(data => {
      this.posts = data;
      // Number of post
      this.postLength = data.length;
    });
    this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
      this.comments = data;
      // Number of post
      this.commentLength = data.length;
    });
  }

  ngOnInit(): void {
  }

}