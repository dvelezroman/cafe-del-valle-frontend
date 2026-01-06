import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { GalleryImage } from '../../services/data';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery {
  constructor(public dataService: DataService) {}
  
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
}
