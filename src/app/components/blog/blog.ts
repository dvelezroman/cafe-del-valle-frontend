import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, BlogPost } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  // Computed signals for reactive data
  blogPosts = computed(() => {
    const posts = this.dataService.blogPosts();
    // Sort by date (newest first) and take latest 6
    return [...posts]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
  });

  featuredPosts = computed(() => {
    return this.dataService.blogPosts().filter(p => p.featured);
  });

  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    // Ensure data is fetched when component initializes
    if (this.dataService.blogPosts().length === 0) {
      this.dataService.fetchBlogPosts().subscribe({
        next: () => {
          console.log('Blog posts loaded:', this.dataService.blogPosts().length);
        },
        error: (err) => {
          console.error('Error loading blog posts:', err);
        }
      });
    }
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
