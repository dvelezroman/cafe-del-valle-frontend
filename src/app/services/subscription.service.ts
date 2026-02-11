import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type BillingPeriod = 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export interface SubscriptionPlan {
    id: string;
    title: any; // Json in DB, handled as object here
    description: any;
    price: number;
    features: any;
    active: boolean;
    order: number;
    billingPeriod?: BillingPeriod;
    billingDuration?: number; // For CUSTOM period, duration in months
    billingDurationLabel?: any; // Json - Custom label like "3 meses", "6 meses", etc.
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionInterest {
    id: string;
    planId: string;
    plan?: SubscriptionPlan;
    name: string;
    email: string;
    phone: string;
    preferences?: any;
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private http = inject(HttpClient);
    // Hardcoded for now to match AuthService pattern and avoid missing environment file issues
    private apiUrl = 'http://localhost:3000/api/subscription';

    // Signals for state management (optional, but good for reactivity)
    plans = signal<SubscriptionPlan[]>([]);
    interests = signal<SubscriptionInterest[]>([]);

    // Public
    getPublicPlans(): Observable<SubscriptionPlan[]> {
        return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`);
    }

    submitInterest(data: any): Observable<SubscriptionInterest> {
        return this.http.post<SubscriptionInterest>(`${this.apiUrl}/interest`, data);
    }

    // Admin
    getAdminPlans(): Observable<SubscriptionPlan[]> {
        return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/admin/plans`).pipe(
            tap(plans => this.plans.set(plans))
        );
    }

    createPlan(data: any): Observable<SubscriptionPlan> {
        return this.http.post<SubscriptionPlan>(`${this.apiUrl}/admin/plans`, data).pipe(
            tap(() => this.getAdminPlans().subscribe()) // Refresh list
        );
    }

    updatePlan(id: string, data: any): Observable<SubscriptionPlan> {
        return this.http.patch<SubscriptionPlan>(`${this.apiUrl}/admin/plans/${id}`, data).pipe(
            tap(() => this.getAdminPlans().subscribe()) // Refresh list
        );
    }

    deletePlan(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/plans/${id}`).pipe(
            tap(() => this.getAdminPlans().subscribe()) // Refresh list
        );
    }

    getAdminInterests(): Observable<SubscriptionInterest[]> {
        return this.http.get<SubscriptionInterest[]>(`${this.apiUrl}/admin/interests`).pipe(
            tap(interests => this.interests.set(interests))
        );
    }

    updateInterestStatus(id: string, status: string): Observable<SubscriptionInterest> {
        return this.http.patch<SubscriptionInterest>(`${this.apiUrl}/admin/interests/${id}`, { status }).pipe(
            tap(() => this.getAdminInterests().subscribe())
        );
    }
}
