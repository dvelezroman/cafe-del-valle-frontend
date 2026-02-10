import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Note: Update this URL when deploying
const API_URL = 'http://localhost:3000/api';

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

export interface Subscriber {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    quotaRemaining: number | null;
    quotaUsed: number;
    createdAt: string;
    code: {
        code: string;
    };
    plan: {
        title: { es: string; en: string };
        price: number;
    };
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
        return this.http.get<typeof this.codeStats>(` ${this.baseUrl}/codes/stats`)
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

    getSubscriberById(id: string) {
        return this.http.get<Subscriber>(`${this.baseUrl}/subscribers/${id}`);
    }

    updateSubscriberStatus(id: string, status: string) {
        return this.http.patch(`${this.baseUrl}/subscribers/${id}/status`, { status })
            .pipe(tap(() => this.getAllSubscribers().subscribe()));
    }

    getSubscriberHistory(id: string) {
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
