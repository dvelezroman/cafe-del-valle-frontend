import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SubscriberCode {
    id: string;
    code: string;
    status: 'GENERATED' | 'ASSIGNED' | 'REVOKED';
    subscriberId: string | null;
    generatedAt: string;
    assignedAt: string | null;
    revokedAt: string | null;
    subscriber?: {
        name: string;
        email: string;
    };
}

export interface SubscriptionDiscount {
    id: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'POINTS_REDEMPTION';
    discountValue: number;
    promotionId?: string;
    pointsUsed?: number;
    active: boolean;
    validUntil?: string;
    promotion?: {
        name: { es: string; en: string };
    };
}

export interface Subscriber {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
    quotaRemaining: number | null;
    quotaUsed: number;
    createdAt: string;
    code?: {
        code: string;
        status?: 'GENERATED' | 'ASSIGNED' | 'REVOKED';
    };
    plan?: {
        title: { es: string; en: string };
        price: number;
    };
    partnerProfileId?: string;
    partnerProfile?: {
        id: string;
        points: number;
        referralCode: string;
    };
    originalPrice: number;
    discountedPrice?: number;
    discounts?: SubscriptionDiscount[];
    notes?: string;
    usageEvents?: UsageEvent[];
}

export interface UsageEvent {
    id: string;
    timestamp: string;
    itemType: string;
    quantity: number;
    notes?: string;
    subscriber: {
        name: string;
        code: {
            code: string;
        };
    };
    recordedBy: {
        name: string;
    };
}

@Injectable({ providedIn: 'root' })
export class SubscriberManagementService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/subscription/admin`;

    codes = signal<SubscriberCode[]>([]);
    subscribers = signal<Subscriber[]>([]);
    usageEvents = signal<UsageEvent[]>([]);
    codeStats = signal({
        total: 0,
        generated: 0,
        assigned: 0,
        revoked: 0,
        available: 0
    });

    // Code Management
    generateCodes(quantity: number, prefix?: string) {
        return this.http.post<SubscriberCode[]>(`${this.baseUrl}/codes/generate`, { quantity, prefix })
            .pipe(tap(codes => this.codes.update(existing => [...codes, ...existing])));
    }

    getAllCodes(status?: string) {
        const url = status ? `${this.baseUrl}/codes?status=${status}` : `${this.baseUrl}/codes`;
        return this.http.get<SubscriberCode[]>(url)
            .pipe(tap(codes => this.codes.set(codes)));
    }

    getCodeStats() {
        return this.http.get<{ total: number; generated: number; assigned: number; revoked: number; available: number }>(`${this.baseUrl}/codes/stats`)
            .pipe(tap(stats => this.codeStats.set(stats)));
    }

    downloadCodesPDF(status?: string, codeIds?: string[]) {
        let url = `${this.baseUrl}/codes/download-pdf`;
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (codeIds && codeIds.length > 0) params.append('codeIds', codeIds.join(','));

        if (params.toString()) url += `?${params.toString()}`;

        return this.http.get(url, { responseType: 'blob' });
    }

    revokeCode(id: string) {
        return this.http.patch(`${this.baseUrl}/codes/${id}/revoke`, {})
            .pipe(tap(() => this.getAllCodes().subscribe()));
    }

    validateCode(code: string) {
        return this.http.get(`${this.baseUrl}/codes/validate/${code}`);
    }

    // Subscriber Management
    createSubscriber(data: {
        codeId: string;
        name: string;
        email: string;
        phone: string;
        planId: string;
        notes?: string;
    }) {
        return this.http.post<Subscriber>(`${this.baseUrl}/subscribers`, data)
            .pipe(tap(() => this.getAllSubscribers().subscribe()));
    }

    getAllSubscribers(status?: string) {
        const url = status ? `${this.baseUrl}/subscribers?status=${status}` : `${this.baseUrl}/subscribers`;
        return this.http.get<Subscriber[]>(url)
            .pipe(tap(subscribers => this.subscribers.set(subscribers)));
    }

    // Get subscriber by ID
    getSubscriber(id: string): Observable<Subscriber> {
        return this.http.get<Subscriber>(`${this.baseUrl}/subscribers/${id}`);
    }

    // Get subscriber by Code
    getSubscriberByCode(code: string): Observable<Subscriber> {
        return this.http.get<Subscriber>(`${this.baseUrl}/subscribers/by-code/${code}`);
    }

    // Update subscriber status
    updateSubscriberStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'PENDING'): Observable<Subscriber> {
        return this.http.patch<Subscriber>(`${this.baseUrl}/subscribers/${id}/status`, { status })
            .pipe(tap(() => this.getAllSubscribers().subscribe()));
    }

    // Assign code to pending subscriber
    assignCodeToPendingSubscriber(subscriberId: string, codeId: string): Observable<Subscriber> {
        return this.http.patch<Subscriber>(`${this.baseUrl}/subscribers/${subscriberId}/assign-code`, { codeId })
            .pipe(tap(() => this.getAllSubscribers().subscribe()));
    }

    // Get History
    getUsageHistory(id: string): Observable<UsageEvent[]> {
        return this.http.get<UsageEvent[]>(`${this.baseUrl}/subscribers/${id}/history`);
    }

    // Usage/Redemption
    logUsage(data: {
        subscriberId: string;
        itemType: string;
        quantity: number;
        notes?: string;
    }) {
        return this.http.post<UsageEvent>(`${this.baseUrl}/redemptions`, data)
            .pipe(tap(() => this.getAllUsageEvents().subscribe()));
    }

    getAllUsageEvents() {
        return this.http.get<UsageEvent[]>(`${this.baseUrl}/redemptions`)
            .pipe(tap(events => this.usageEvents.set(events)));
    }
}
