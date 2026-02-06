import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Coffee } from '../coffee/coffee';
import { Menu } from '../menu/menu';
import { Gallery } from '../gallery/gallery';
import { Reviews } from '../reviews/reviews';
import { Blog } from '../blog/blog';
import { Contact } from '../contact/contact';
import { TranslationService, Language } from '../../services/translation.service';
import { SubscriptionPlansPublicComponent } from '../subscription-plans-public/subscription-plans-public';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Hero,
    About,
    Coffee,
    Menu,
    Gallery,
    Reviews,
    Blog,
    Contact,
    SubscriptionPlansPublicComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  menuOpen = false;
  currentLanguage: Language = 'es';
  languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' }
  ];
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  constructor(public translationService: TranslationService) { }

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
