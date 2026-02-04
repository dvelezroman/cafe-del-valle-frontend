import { Component, computed } from '@angular/core';
import { DataService } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) { }

  cafeInfo = computed(() => this.dataService.cafeInfo());

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }
}
