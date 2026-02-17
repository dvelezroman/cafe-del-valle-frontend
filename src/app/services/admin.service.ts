import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private baseUrl = `${environment.apiUrl}`;

  /**
   * Generic GET request with error handling
   */
  get<T>(endpoint: string, params?: any, options?: any): Observable<T> {
    const requestOptions = { ...options, params };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, requestOptions)
      .pipe(
        map((response: any) => {
          // If responseType is blob, return the blob directly
          if (options?.responseType === 'blob') {
            return response as T;
          }
          return response as T;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Generic POST request with error handling
   */
  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, options)
      .pipe(
        map((response: any) => {
          // If responseType is blob, return the blob directly
          if (options?.responseType === 'blob') {
            return response as T;
          }
          return response as T;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Generic PUT request with error handling
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Generic PATCH request with error handling
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Generic DELETE request with error handling
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Solicitud inválida';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 422:
          errorMessage = error.error?.message || 'Error de validación';
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, intenta más tarde';
          break;
        default:
          errorMessage = error.error?.message || `Error: ${error.status}`;
      }
    }

    this.toastService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Cafe Info
  getCafeInfo() {
    return this.get<any>('/cafe/info');
  }

  updateCafeInfo(data: any) {
    return this.put<any>('/cafe/info', data);
  }

  // Menu Items
  getMenuItems(category?: string, available?: boolean, featured?: boolean) {
    const params: any = {};
    if (category) params.category = category;
    if (available !== undefined) params.available = available.toString();
    if (featured !== undefined) params.featured = featured.toString();
    return this.get<any[]>('/menu/items', params);
  }

  createMenuItem(data: any) {
    return this.post<any>('/menu/items', data);
  }

  updateMenuItem(id: string, data: any) {
    return this.put<any>(`/menu/items/${id}`, data);
  }

  deleteMenuItem(id: string) {
    return this.delete<any>(`/menu/items/${id}`);
  }

  // Blog Posts
  getBlogPosts() {
    return this.get<any[]>('/blog/posts');
  }

  getBlogPost(id: string) {
    return this.get<any>(`/blog/posts/${id}`);
  }

  createBlogPost(data: any) {
    return this.post<any>('/blog/posts', data);
  }

  updateBlogPost(id: string, data: any) {
    return this.put<any>(`/blog/posts/${id}`, data);
  }

  deleteBlogPost(id: string) {
    return this.delete<any>(`/blog/posts/${id}`);
  }

  // Blog Categories
  getBlogCategories() {
    return this.get<any[]>('/blog/categories');
  }

  createBlogCategory(data: any) {
    return this.post<any>('/blog/categories', data);
  }

  updateBlogCategory(id: string, data: any) {
    return this.put<any>(`/blog/categories/${id}`, data);
  }

  deleteBlogCategory(id: string) {
    return this.delete<any>(`/blog/categories/${id}`);
  }

  // Partners
  getPendingPartners() {
    return this.get<any[]>('/admin/partners/pending');
  }

  getAllPartners() {
    return this.get<any[]>('/admin/partners');
  }

  validatePartner(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.patch<any>(`/admin/partners/${id}/validate`, { status });
  }

  updatePartnerPoints(id: string, points: number, reason: string) {
    return this.patch<any>(`/admin/partners/${id}/points`, { points, reason });
  }

  getPartnerConsumption(id: string) {
    return this.get<any[]>(`/admin/partners/${id}/consumption-history`);
  }

  getAllConsumptionRecords(partnerId?: string) {
    return this.get<any[]>('/admin/consumption-records', partnerId ? { partnerId } : undefined);
  }

  // Promotions
  getPromotions() {
    return this.get<any[]>('/admin/promotions');
  }

  createPromotion(data: any) {
    return this.post<any>('/admin/promotions', data);
  }

  updatePromotion(id: string, data: any) {
    return this.put<any>(`/admin/promotions/${id}`, data);
  }

  deletePromotion(id: string) {
    return this.delete<any>(`/admin/promotions/${id}`);
  }

  getGlobalConfig() {
    return this.get<any>('/admin/config');
  }

  updateReferralPoints(points: number) {
    return this.patch<any>('/admin/config/referral-points', { points });
  }

  // Subscription Plans
  getSubscriptionPlans() {
    return this.get<any[]>('/subscription/admin/plans');
  }

  createSubscriptionPlan(data: any) {
    return this.post<any>('/subscription/admin/plans', data);
  }

  updateSubscriptionPlan(id: string, data: any) {
    return this.patch<any>(`/subscription/admin/plans/${id}`, data);
  }

  deleteSubscriptionPlan(id: string) {
    return this.delete<any>(`/subscription/admin/plans/${id}`);
  }

  // Subscription Interests
  getSubscriptionInterests() {
    return this.get<any[]>('/subscription/admin/interests');
  }

  updateSubscriptionInterest(id: string, data: any) {
    return this.patch<any>(`/subscription/admin/interests/${id}`, data);
  }

  // Subscriber Codes
  generateCodes(quantity: number, prefix?: string) {
    return this.post<any[]>('/subscription/admin/codes/generate', { quantity, prefix });
  }

  getAllCodes(status?: string) {
    const params = status ? { status } : {};
    return this.get<any[]>('/subscription/admin/codes', params);
  }

  getCodeStats() {
    return this.get<any>('/subscription/admin/codes/stats');
  }

  revokeCode(id: string) {
    return this.patch<any>(`/subscription/admin/codes/${id}/revoke`, {});
  }

  downloadCodesPDF(codeIds?: string[]) {
    if (codeIds && codeIds.length > 0) {
      return this.http.post<Blob>(`${this.baseUrl}/subscription/admin/codes/download-pdf`, { codeIds }, { responseType: 'blob' as 'json' })
        .pipe(
          catchError(this.handleError.bind(this))
        );
    }
    return this.get<Blob>('/subscription/admin/codes/download-pdf', {}, { responseType: 'blob' as 'json' });
  }

  // Subscribers
  getSubscribers(status?: string) {
    const params = status ? { status } : {};
    return this.get<any[]>('/subscription/admin/subscribers', params);
  }

  getSubscriber(id: string) {
    return this.get<any>(`/subscription/admin/subscribers/${id}`);
  }

  getSubscriberByCode(code: string) {
    return this.get<any>(`/subscription/admin/subscribers/by-code/${code}`);
  }

  createSubscriber(data: any) {
    return this.post<any>('/subscription/admin/subscribers', data);
  }

  updateSubscriberStatus(id: string, status: string) {
    return this.patch<any>(`/subscription/admin/subscribers/${id}/status`, { status });
  }

  assignCodeToSubscriber(subscriberId: string, codeId: string) {
    return this.patch<any>(`/subscription/admin/subscribers/${subscriberId}/assign-code`, { codeId });
  }

  getSubscriberHistory(id: string) {
    return this.get<any[]>(`/subscription/admin/subscribers/${id}/history`);
  }

  // Redemptions/Usage Events
  logUsage(data: any) {
    return this.post<any>('/subscription/admin/redemptions', data);
  }

  getAllUsageEvents(subscriberId?: string, code?: string) {
    const params: any = {};
    if (subscriberId) params.subscriberId = subscriberId;
    if (code) params.code = code;
    return this.get<any[]>('/subscription/admin/redemptions', params);
  }

  // Reviews
  getReviews(approved?: boolean) {
    const params = approved !== undefined ? { approved: approved.toString() } : {};
    return this.get<any[]>('/reviews', params);
  }

  updateReview(id: string, data: any) {
    return this.put<any>(`/reviews/${id}`, data);
  }

  approveReview(id: string) {
    return this.patch<any>(`/reviews/${id}/approve`, {});
  }

  deleteReview(id: string) {
    return this.delete<any>(`/reviews/${id}`);
  }

  // Gallery
  getGalleryImages() {
    return this.get<any[]>('/gallery/images');
  }

  createGalleryImage(data: any) {
    return this.post<any>('/gallery/images', data);
  }

  updateGalleryImage(id: string, data: any) {
    return this.put<any>(`/gallery/images/${id}`, data);
  }

  deleteGalleryImage(id: string) {
    return this.delete<any>(`/gallery/images/${id}`);
  }

  // Coffee Varieties
  getCoffeeVarieties() {
    return this.get<any[]>('/cafe/varieties');
  }

  createCoffeeVariety(data: any) {
    return this.post<any>('/cafe/varieties', data);
  }

  updateCoffeeVariety(id: string, data: any) {
    return this.put<any>(`/cafe/varieties/${id}`, data);
  }

  deleteCoffeeVariety(id: string) {
    return this.delete<any>(`/cafe/varieties/${id}`);
  }

  // Google Maps Reviews
  syncGoogleMapsReviews(placeId?: string, force?: boolean) {
    return this.post<any>('/google-maps/admin/reviews/sync', { placeId, force });
  }

  getGoogleMapsReviews(limit?: number) {
    return this.get<any[]>('/google-maps/admin/reviews', limit ? { limit } : undefined);
  }

  getGoogleMapsStats() {
    return this.get<any>('/google-maps/admin/stats');
  }

  getGoogleMapsConfig() {
    return this.get<any>('/google-maps/admin/config');
  }

  updateGoogleMapsConfig(data: { placeId?: string }) {
    return this.post<any>('/google-maps/admin/config', data);
  }

  // User Management
  getUsers() {
    return this.get<any[]>('/admin/users');
  }

  getUser(id: string) {
    return this.get<any>(`/admin/users/${id}`);
  }

  createUser(data: { email: string; password: string; name: string; role?: string; active?: boolean }) {
    return this.post<any>('/admin/users', data);
  }

  updateUser(id: string, data: { email?: string; password?: string; name?: string; role?: string; active?: boolean }) {
    return this.put<any>(`/admin/users/${id}`, data);
  }

  toggleUserActive(id: string) {
    return this.patch<any>(`/admin/users/${id}/toggle-active`, {});
  }

  deleteUser(id: string) {
    return this.delete<any>(`/admin/users/${id}`);
  }
}
