import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SubscriberManagementService, Subscriber } from '../../../services/subscriber-management.service';

export interface UsageEvent {
    id: string;
    subscriberId: string;
    timestamp: string;
    itemType: string;
    quantity: number;
    notes?: string;
    subscriber: {
        id: string;
        name: string;
        email: string;
        code?: {
            code: string;
        };
        plan?: {
            title: { es: string; en: string };
        };
    };
    recordedBy: {
        name: string;
        email: string;
    };
}

@Component({
    selector: 'app-subscriber-redemption-history',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './subscriber-redemption-history.html',
    styleUrl: './subscriber-redemption-history.scss'
})
export class SubscriberRedemptionHistoryComponent implements OnInit {
    private http = inject(HttpClient);
    private subscriberService = inject(SubscriberManagementService);
    private baseUrl = `${environment.apiUrl}/subscription/admin`;

    usageEvents = signal<UsageEvent[]>([]);
    subscribers = signal<Subscriber[]>([]);
    isLoading = signal(false);
    
    // Filters
    selectedSubscriberId = signal<string>('');
    codeFilter = signal<string>('');
    
    // Computed
    filteredEvents = computed(() => {
        let events = this.usageEvents();
        
        if (this.selectedSubscriberId()) {
            events = events.filter(e => e.subscriberId === this.selectedSubscriberId());
        }
        
        if (this.codeFilter()) {
            const codeLower = this.codeFilter().toLowerCase().trim();
            events = events.filter(e => 
                e.subscriber.code?.code?.toLowerCase().includes(codeLower)
            );
        }
        
        return events;
    });

    ngOnInit() {
        this.loadUsageEvents();
        this.loadSubscribers();
    }

    loadUsageEvents() {
        this.isLoading.set(true);
        const subscriberId = this.selectedSubscriberId() || undefined;
        const code = this.codeFilter() || undefined;
        
        const params: any = {};
        if (subscriberId) params.subscriberId = subscriberId;
        if (code) params.code = code;

        this.http.get<UsageEvent[]>(`${this.baseUrl}/redemptions`, { params }).subscribe({
            next: (events) => {
                this.usageEvents.set(events);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    loadSubscribers() {
        this.http.get<Subscriber[]>(`${this.baseUrl}/subscribers`).subscribe({
            next: (subscribers) => {
                this.subscribers.set(subscribers);
            }
        });
    }

    onSubscriberFilterChange() {
        this.loadUsageEvents();
    }

    onCodeFilterChange() {
        // Debounce would be nice but for now just filter client-side
        // The code filter works client-side since we already have all events
    }

    clearFilters() {
        this.selectedSubscriberId.set('');
        this.codeFilter.set('');
        this.loadUsageEvents();
    }

    getSubscriberName(subscriberId: string): string {
        const subscriber = this.subscribers().find(s => s.id === subscriberId);
        return subscriber?.name || 'Unknown';
    }
}
