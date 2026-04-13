import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { TranslationService } from './translation.service';
import { environment } from '../../environments/environment';

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
  title: string; // Changed from any to string
  slug: string;
  excerpt: string; // Changed from any to string
  content: string; // Changed from any to string
  author: string;
  publishedAt: string;
  image?: string;
  category?: string; // Changed from any to string
  tags?: string[];
  featured?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  order?: number;
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
  private apiUrl = environment.apiUrl;
  private translationService = inject(TranslationService);

  // Signals for state management
  cafeInfo = signal<CafeInfo | null>(null);
  coffeeVarieties = signal<CoffeeVariety[]>([]);
  menuItems = signal<MenuItem[]>([]);
  branches = signal<Branch[]>([]);
  /** Active public branch for menu filtering; persisted in localStorage */
  selectedBranchId = signal<string | null>(null);
  private readonly branchStorageKey = 'cafe-del-valle-branch-id';
  reviews = signal<Review[]>([]);
  googleMapsReviews = signal<any[]>([]);
  galleryImages = signal<GalleryImage[]>([]);
  blogPosts = signal<BlogPost[]>([]);

  constructor(private http: HttpClient) {
    this.initData();
  }

  private initData() {
    this.fetchCafeInfo().subscribe();
    this.fetchCoffeeVarieties().subscribe();
    this.fetchBranches().subscribe({
      next: () => this.fetchMenuItems().subscribe(),
      error: () => this.fetchMenuItems().subscribe()
    });
    this.fetchReviews().subscribe();
    this.fetchGoogleMapsReviews().subscribe();
    this.fetchGalleryImages().subscribe();
    this.fetchBlogPosts().subscribe();
  }

  fetchCafeInfo(): Observable<CafeInfo> {
    return this.http.get<any>(`${this.apiUrl}/cafe/info`).pipe(
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
    return this.http.get<CoffeeVariety[]>(`${this.apiUrl}/cafe/varieties`).pipe(
      tap(res => this.coffeeVarieties.set(res))
    );
  }

  fetchBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`).pipe(
      tap((list) => {
        this.branches.set(list || []);
        this.applyDefaultBranchSelection(list || []);
      })
    );
  }

  private applyDefaultBranchSelection(list: Branch[]) {
    if (list.length === 0) {
      this.selectedBranchId.set(null);
      return;
    }
    const stored = localStorage.getItem(this.branchStorageKey);
    const valid = stored && list.some((b) => b.id === stored);
    this.selectedBranchId.set(valid ? stored! : list[0].id);
  }

  setSelectedBranchId(id: string) {
    this.selectedBranchId.set(id);
    localStorage.setItem(this.branchStorageKey, id);
    this.fetchMenuItems().subscribe();
  }

  fetchMenuItems(): Observable<MenuItem[]> {
    const bid = this.selectedBranchId();
    let params = new HttpParams();
    if (bid) {
      params = params.set('branchId', bid);
    }
    return this.http.get<any[]>(`${this.apiUrl}/menu/items`, { params }).pipe(
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

  fetchGoogleMapsReviews(limit?: number): Observable<any[]> {
    const params = limit ? { limit: limit.toString() } : undefined;
    return this.http.get<any[]>(`${this.apiUrl}/google-maps/reviews`, { params }).pipe(
      tap(res => this.googleMapsReviews.set(res || []))
    );
  }

  fetchGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/gallery/images`).pipe(
      tap(res => this.galleryImages.set(res))
    );
  }

  fetchBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blog/posts`).pipe(
      map(res => {
        const lang = this.translationService.getCurrentLanguageValue();
        const transformed = res.map((post: any) => ({
          ...post,
          title: this.extractLangValue(post.title, lang),
          excerpt: this.extractLangValue(post.excerpt, lang),
          content: this.extractLangValue(post.content, lang),
          category: (typeof post.category === 'object' && post.category?.name)
            ? this.extractLangValue(post.category.name, lang)
            : this.extractLangValue(post.category, lang)
        }));
        return transformed;
      }),
      tap(posts => this.blogPosts.set(posts))
    );
  }

  // Helper method to extract language-specific value from multilingual object
  private extractLangValue(value: any, lang: string): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      return value[lang] || value['es'] || JSON.stringify(value);
    }
    return String(value || '');
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
