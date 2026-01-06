import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) {}
  
  get cafeInfo() {
    return this.dataService.getCafeInfo();
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
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
    }
  }
}
