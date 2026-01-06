import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Coffee } from './components/coffee/coffee';
import { Gallery } from './components/gallery/gallery';
import { Reviews } from './components/reviews/reviews';
import { Contact } from './components/contact/contact';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Hero,
    About,
    Coffee,
    Gallery,
    Reviews,
    Contact
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Café del Valle';
  menuOpen = false;
  
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
