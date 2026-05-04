import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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

export interface MembershipApplication {
    id: string;
    planId: string;
    plan?: SubscriptionPlan;
    name: string;
    email: string;
    phone: string;
    idNumber: string;
    preferences?: any;
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

/** @deprecated use MembershipApplication */
export type SubscriptionInterest = MembershipApplication;

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/subscription`;

    // Signals for state management (optional, but good for reactivity)
    plans = signal<SubscriptionPlan[]>([]);
    interests = signal<SubscriptionInterest[]>([]);

    // Public
    getPublicPlans(): Observable<SubscriptionPlan[]> {
        return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`);
    }

    submitInterest(data: any): Observable<MembershipApplication> {
        return this.http.post<MembershipApplication>(`${this.apiUrl}/application`, data);
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

    getAdminInterests(): Observable<MembershipApplication[]> {
        return this.http.get<MembershipApplication[]>(`${this.apiUrl}/admin/applications`).pipe(
            tap((rows) => this.interests.set(rows))
        );
    }

    updateInterestStatus(id: string, status: string, notes?: string): Observable<MembershipApplication> {
        return this.http
            .patch<MembershipApplication>(`${this.apiUrl}/admin/applications/${id}`, { status, notes })
            .pipe(tap(() => this.getAdminInterests().subscribe()));
    }
}
