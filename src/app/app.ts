import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Coffee } from './components/coffee/coffee';
import { Menu } from './components/menu/menu';
import { Gallery } from './components/gallery/gallery';
import { Reviews } from './components/reviews/reviews';
import { Blog } from './components/blog/blog';
import { Contact } from './components/contact/contact';
import { TranslationService, Language } from './services/translation.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    Hero,
    About,
    Coffee,
    Menu,
    Gallery,
    Reviews,
    Blog,
    Contact
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'Café del Valle';
  menuOpen = false;
  currentLanguage: Language = 'es';
  languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' }
  ];

  constructor(public translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  setLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }
  
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
  
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  closeMenu() {
    this.menuOpen = false;
  }
}
