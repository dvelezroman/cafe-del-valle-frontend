import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriberManagementService, Subscriber } from '../../../services/subscriber-management.service';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
    selector: 'app-subscriber-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscriber-management.html',
    styleUrl: './subscriber-management.scss'
})
export class SubscriberManagementComponent implements OnInit {
    private subscriberService = inject(SubscriberManagementService);
    private subscriptionService = inject(SubscriptionService);

    subscribers = this.subscriberService.subscribers;
    plans = this.subscriptionService.plans;
    availableCodes = signal<any[]>([]);

    isModalOpen = signal(false);
    selectedSubscriber = signal<Subscriber | null>(null);

    formData = signal({
        codeId: '',
        name: '',
        email: '',
        phone: '',
        planId: '',
        notes: ''
    });

    ngOnInit() {
        this.subscriberService.getAllSubscribers().subscribe();
        this.subscriptionService.getAdminPlans().subscribe();
        this.loadAvailableCodes();
    }

    loadAvailableCodes() {
        this.subscriberService.getAllCodes('GENERATED').subscribe({
            next: (codes) => this.availableCodes.set(codes)
        });
    }

    openCreateModal() {
        this.selectedSubscriber.set(null);
        this.resetForm();
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    resetForm() {
        this.formData.set({
            codeId: '',
            name: '',
            email: '',
            phone: '',
            planId: '',
            notes: ''
        });
    }

    createSubscriber() {
        const data = this.formData();
        if (!data.codeId || !data.name || !data.email || !data.phone || !data.planId) {
            alert('Please fill in all required fields');
            return;
        }

        this.subscriberService.createSubscriber(data).subscribe({
            next: () => {
                this.closeModal();
                this.loadAvailableCodes();
            },
            error: (err) => {
                alert(err.error?.message || 'Failed to create subscriber');
            }
        });
    }

    updateStatus(id: string, status: string) {
        if (confirm(`Change subscriber status to ${status}?`)) {
            this.subscriberService.updateSubscriberStatus(id, status).subscribe({
                error: () => alert('Failed to update status')
            });
        }
    }
}
