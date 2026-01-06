import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { Review } from '../../services/data';

@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss'
})
export class Reviews {
  constructor(public dataService: DataService) {}
  
  get reviews(): Review[] {
    return this.dataService.getReviews();
  }
  
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
