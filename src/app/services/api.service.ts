import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CafeInfo, 
  CoffeeVariety, 
  Review, 
  GalleryImage, 
  BlogPost 
} from './data';

/**
 * Servicio API para integración con Headless CMS
 * 
 * Este servicio está preparado para conectarse a un Headless CMS como:
 * - Strapi
 * - Contentful
 * - Sanity
 * - Directus
 * - WordPress (Headless)
 * 
 * Para usar este servicio:
 * 1. Configura HttpClientModule en app.config.ts
 * 2. Define la URL base de tu API en environment.ts
 * 3. Reemplaza los métodos en DataService para usar este servicio
 * 
 * Ejemplo de configuración:
 * 
 * // environment.ts
 * export const environment = {
 *   apiUrl: 'https://api.cafedelvalle.com'
 * };
 * 
 * // En DataService:
 * constructor(private apiService: ApiService) {}
 * 
 * getCafeInfo(): Observable<CafeInfo> {
 *   return this.apiService.getCafeInfo();
 * }
 */

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Esta URL debe configurarse en environment.ts
  private apiUrl = 'https://api.cafedelvalle.com/api'; // Ejemplo

  constructor(private http: HttpClient) {}

  // Endpoints para información del café
  getCafeInfo(): Observable<CafeInfo> {
    return this.http.get<CafeInfo>(`${this.apiUrl}/cafe/info`);
  }

  // Endpoints para variedades de café
  getCoffeeVarieties(): Observable<CoffeeVariety[]> {
    return this.http.get<CoffeeVariety[]>(`${this.apiUrl}/cafe/varieties`);
  }

  getCoffeeVarietyById(id: string): Observable<CoffeeVariety> {
    return this.http.get<CoffeeVariety>(`${this.apiUrl}/cafe/varieties/${id}`);
  }

  // Endpoints para reseñas
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`);
  }

  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review);
  }

  // Endpoints para galería
  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/gallery/images`);
  }

  // Endpoints para blog
  getBlogPosts(params?: { 
    limit?: number; 
    category?: string; 
    featured?: boolean;
    sort?: string;
  }): Observable<BlogPost[]> {
    let url = `${this.apiUrl}/blog/posts`;
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    return this.http.get<BlogPost[]>(url);
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/blog/posts/${slug}`);
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/blog/posts/${id}`);
  }

  getFeaturedPosts(): Observable<BlogPost[]> {
    return this.getBlogPosts({ featured: true });
  }

  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return this.getBlogPosts({ category });
  }

  getLatestPosts(limit: number = 3): Observable<BlogPost[]> {
    return this.getBlogPosts({ limit, sort: 'publishedAt:desc' });
  }
}

