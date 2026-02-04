import { Component, computed } from '@angular/core';
import { DataService } from '../../services/data';
import { CoffeeVariety } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-coffee',
  imports: [],
  templateUrl: './coffee.html',
  styleUrl: './coffee.scss'
})
export class Coffee {
  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) { }

  coffeeVarieties = computed(() => this.dataService.coffeeVarieties());

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }

  getCoffeeDescription(variety: CoffeeVariety): string {
    const keyMap: { [key: string]: string } = {
      '1': 'coffee.typica.description',
      '2': 'coffee.bourbon.description',
      '3': 'coffee.caturra.description',
      '4': 'coffee.especial.description'
    };
    const translationKey = keyMap[variety.id];
    return translationKey ? this.translate(translationKey) : variety.description;
  }

  translateFlavorNote(note: string): string {
    const noteKeyMap: { [key: string]: string } = {
      'Dulce': 'coffee.notes.dulce',
      'Cítrico': 'coffee.notes.citrico',
      'Equilibrado': 'coffee.notes.equilibrado',
      'Intenso': 'coffee.notes.intenso',
      'Aromático': 'coffee.notes.aromatico',
      'Cuerpo completo': 'coffee.notes.cuerpo.completo',
      'Frutal': 'coffee.notes.frutal',
      'Acidez brillante': 'coffee.notes.acidez.brillante',
      'Acabado limpio': 'coffee.notes.acabado.limpio',
      'Chocolate': 'coffee.notes.chocolate',
      'Caramelo': 'coffee.notes.caramelo',
      'Excepcional': 'coffee.notes.excepcional'
    };
    const translationKey = noteKeyMap[note];
    return translationKey ? this.translate(translationKey) : note;
  }

  handleImageError(event: Event, variety: CoffeeVariety) {
    const img = event.target as HTMLImageElement;
    // Fallback a imágenes de Unsplash específicas de cada varietal
    const fallbacks: { [key: string]: string } = {
      '1': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80', // Typica - granos tradicionales
      '2': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=600&fit=crop&q=80', // Bourbon - granos premium (URL alternativa)
      '3': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80', // Caturra - preparación artesanal
      '4': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80' // Especial - espresso premium
    };
    const fallback = fallbacks[variety.id];
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    }
  }
}
