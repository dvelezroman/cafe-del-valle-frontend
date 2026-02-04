import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, MenuItem } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

type MenuCategory = 'bebidas' | 'comidas' | 'postres' | 'especiales' | 'todos';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  private dataService = inject(DataService);
  public translationService = inject(TranslationService);

  selectedCategory = signal<MenuCategory>('todos');

  menuItems = this.dataService.menuItems;

  filteredItems = computed(() => {
    const category = this.selectedCategory();
    const items = this.menuItems();
    if (category === 'todos') {
      return items;
    }
    return items.filter(item => item.category === category);
  });

  categories: { value: MenuCategory; labelKey: string }[] = [
    { value: 'todos', labelKey: 'menu.filter.all' },
    { value: 'bebidas', labelKey: 'menu.filter.drinks' },
    { value: 'comidas', labelKey: 'menu.filter.food' },
    { value: 'postres', labelKey: 'menu.filter.desserts' },
    { value: 'especiales', labelKey: 'menu.filter.special' }
  ];

  constructor() { }

  filterByCategory(category: MenuCategory) {
    this.selectedCategory.set(category);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  scrollToSection(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getImageUrl(item: MenuItem): string {
    // Si el item tiene una imagen fallback, úsala
    if ((item as any).fallbackImage) {
      return (item as any).fallbackImage;
    }
    return item.image || this.getFallbackImage(item.category);
  }

  handleImageError(event: Event, item: MenuItem) {
    const img = event.target as HTMLImageElement;
    const fallback = this.getFallbackImage(item.category);
    if (img.src !== fallback) {
      (item as any).fallbackImage = fallback;
      img.src = fallback;
    }
  }

  getFallbackImage(category: MenuItem['category']): string {
    const fallbacks: { [key: string]: string } = {
      'bebidas': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80',
      'comidas': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop&q=80',
      'postres': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', // Brownie con helado
      'especiales': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80'
    };
    return fallbacks[category] || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80';
  }

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }

  getCategoryLabel(category: { value: MenuCategory; labelKey: string }): string {
    return this.translate(category.labelKey);
  }

  getMenuItemDescription(item: MenuItem): string {
    const translationKey = `menu.item.${item.id}.description`;
    const translated = this.translate(translationKey);
    // If translation doesn't exist (returns the key), fallback to original description
    return translated !== translationKey ? translated : item.description;
  }
}
