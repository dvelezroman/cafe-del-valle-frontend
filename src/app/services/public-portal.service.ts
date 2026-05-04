import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PublicLookupBody {
    idNumber: string;
}

@Injectable({ providedIn: 'root' })
export class PublicPortalService {
    private http = inject(HttpClient);
    private base = `${environment.apiUrl}/public`;

    lookupMembership(body: PublicLookupBody): Observable<any> {
        return this.http.post(`${this.base}/membership/lookup`, body);
    }

    lookupLoyalty(body: PublicLookupBody): Observable<any> {
        return this.http.post(`${this.base}/loyalty/lookup`, body);
    }

    /** Subscription plan usage by member / QR code (public, rate-limited). */
    lookupSubscriberByCode(code: string): Observable<any> {
        return this.http.post(`${this.base}/subscriber/lookup`, { code });
    }
}
