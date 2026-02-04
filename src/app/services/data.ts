import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CoffeeVariety {
  id: string;
  name: string;
  region: string;
  description: any;
  flavorNotes: any;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  authorImage?: string;
  photoUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: any;
  title?: any;
}

export interface CafeInfo {
  name: string;
  tagline: any;
  description: any;
  address: string;
  phone: string;
  email?: string;
  hours?: any;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BlogPost {
  id: string;
  title: any;
  slug: string;
  excerpt: any;
  content: any;
  author: string;
  publishedAt: string;
  image?: string;
  category?: any;
  tags?: string[];
  featured?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: any;
  price: number;
  category: 'bebidas' | 'comidas' | 'postres' | 'especiales';
  image?: string;
  available?: boolean;
  featured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  // Signals for state management
  cafeInfo = signal<CafeInfo | null>(null);
  coffeeVarieties = signal<CoffeeVariety[]>([]);
  menuItems = signal<MenuItem[]>([]);
  reviews = signal<Review[]>([]);
  galleryImages = signal<GalleryImage[]>([]);
  blogPosts = signal<BlogPost[]>([]);

  constructor(private http: HttpClient) {
    this.initData();
  }

  private initData() {
    this.fetchCafeInfo().subscribe();
    this.fetchCoffeeVarieties().subscribe();
    this.fetchMenuItems().subscribe();
    this.fetchReviews().subscribe();
    this.fetchGalleryImages().subscribe();
    this.fetchBlogPosts().subscribe();
  }

  fetchCafeInfo(): Observable<CafeInfo> {
    return this.http.get<any>(`${this.apiUrl}/cafe-info`).pipe(
      tap(res => {
        const info = {
          ...res,
          coordinates: { lat: (res as any).latitude, lng: (res as any).longitude }
        };
        this.cafeInfo.set(info);
      })
    );
  }

  fetchCoffeeVarieties(): Observable<CoffeeVariety[]> {
    return this.http.get<CoffeeVariety[]>(`${this.apiUrl}/coffee-varieties`).pipe(
      tap(res => this.coffeeVarieties.set(res))
    );
  }

  fetchMenuItems(): Observable<MenuItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu-items`).pipe(
      tap(res => {
        const items = res.map(i => ({ ...i, category: i.category.toLowerCase() })) as any;
        this.menuItems.set(items);
      })
    );
  }

  fetchReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`).pipe(
      tap(res => this.reviews.set(res))
    );
  }

  fetchGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/gallery/images`).pipe(
      tap(res => this.galleryImages.set(res))
    );
  }

  fetchBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/posts`).pipe(
      tap(res => this.blogPosts.set(res))
    );
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.fetchBlogPosts();
  }

  // Legacy compatibility getters (returning current signal value)
  getCafeInfo() { return this.cafeInfo(); }
  getCoffeeVarieties() { return this.coffeeVarieties(); }
  getMenuItems() { return this.menuItems(); }
  getReviews() { return this.reviews(); }
  getGalleryImages() { return this.galleryImages(); }

  getMenuItemsByCategory(category: string) {
    return this.menuItems().filter(item => item.category === category);
  }

  getFeaturedMenuItems() {
    return this.menuItems().filter(item => item.featured);
  }
}
