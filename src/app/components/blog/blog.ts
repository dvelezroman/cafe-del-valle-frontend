import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, BlogPost } from '../../services/data';
import { TranslationService } from '../../services/translation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  blogPosts$: Observable<BlogPost[]> = new Observable();
  featuredPosts$: Observable<BlogPost[]> = new Observable();
  
  constructor(
    private dataService: DataService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.blogPosts$ = this.dataService.getLatestPosts(6);
    this.featuredPosts$ = this.dataService.getFeaturedPosts();
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const lang = this.translationService.getCurrentLanguageValue();
    const localeMap: { [key: string]: string } = {
      'es': 'es-EC',
      'en': 'en-US',
      'fr': 'fr-FR'
    };
    return date.toLocaleDateString(localeMap[lang] || 'es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  scrollToSection(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
