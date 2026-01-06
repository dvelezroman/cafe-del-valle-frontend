import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { GalleryImage } from '../../services/data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery {
  constructor(
    public dataService: DataService,
    public translationService: TranslationService
  ) {}

  translate(key: string, params?: { [key: string]: string }): string {
    return this.translationService.translate(key, params);
  }
  
  get galleryImages(): GalleryImage[] {
    return this.dataService.getGalleryImages();
  }
  
  selectedImage: GalleryImage | null = null;
  
  openImage(image: GalleryImage) {
    this.selectedImage = image;
  }
  
  closeImage() {
    this.selectedImage = null;
  }
  
  handleImageError(event: Event, image: GalleryImage) {
    const img = event.target as HTMLImageElement;
    const fallback = this.getFallbackImage(image.id);
    if (img.src !== fallback) {
      img.src = fallback;
    }
  }
  
  getFallbackImage(id: string): string {
    // Fallback a imágenes de Unsplash si las imágenes locales no existen
    const fallbacks: { [key: string]: string } = {
      '1': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      '2': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
      '3': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
      '4': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
      '5': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      '6': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80'
    };
    return fallbacks[id] || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80';
  }
}
