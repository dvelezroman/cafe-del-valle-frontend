import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  code?: { code: string };
  plan?: { title: { es: string; en: string } };
}

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
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);

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

        this.adminService.getAllUsageEvents(subscriberId, code).subscribe({
            next: (events: any[]) => {
                this.usageEvents.set(events || []);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    loadSubscribers() {
        this.adminService.getSubscribers().subscribe({
            next: (subscribers: any[]) => {
                this.subscribers.set(subscribers || []);
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

    exportHistory() {
        const csv = [
            ['Fecha', 'Suscriptor', 'Email', 'Código', 'Tipo Item', 'Cantidad', 'Notas', 'Registrado por'].join(','),
            ...this.filteredEvents().map(e => [
                `"${new Date(e.timestamp).toLocaleString()}"`,
                `"${e.subscriber.name}"`,
                `"${e.subscriber.email}"`,
                `"${e.subscriber.code?.code || ''}"`,
                `"${e.itemType}"`,
                `"${e.quantity}"`,
                `"${(e.notes || '').replace(/"/g, '""')}"`,
                `"${e.recordedBy.name}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `historial-canjes-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        this.toastService.success('Historial exportado correctamente');
    }

    getSubscriberName(subscriberId: string): string {
        const subscriber = this.subscribers().find(s => s.id === subscriberId);
        return subscriber?.name || 'Unknown';
    }
}
