import { Component, OnInit } from '@angular/core';
import { PostModel } from 'src/app/shared/post.model';
import { PostService } from 'src/app/shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError, from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {CommentPayload} from 'src/app/comment/comment.payload';
import {CommentService} from 'src/app/comment/comment.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number;
  post: PostModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];


  constructor(private postService: PostService, private activateRoute: ActivatedRoute, 
    private commentService: CommentService, private router: Router) {

    // post id is passed as query parameter, so we extract it from activateRoute
    this.postId = this.activateRoute.snapshot.params.id;
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
    
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      postId: this.postId
    };
  }


  ngOnInit(): void {
    // Whenever we try to reload view-post component to load the post information
    // and comment information from backend, we will below methods. 
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text').value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text').setValue('');
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    })
  }

  private getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }


}
