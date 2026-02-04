import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data';

@Component({
  selector: 'app-blog-management',
  imports: [CommonModule],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.scss'
})
export class BlogManagement implements OnInit {
  posts: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getBlogPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
