import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriberManagementService, Subscriber } from '../../../services/subscriber-management.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { ToastService } from '../../../services/toast.service';

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
    private toastService = inject(ToastService);

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
            this.toastService.error('Please fill in all required fields');
            return;
        }

        this.subscriberService.createSubscriber(data).subscribe({
            next: () => {
                this.closeModal();
                this.loadAvailableCodes();
            },
            error: (err: any) => {
                this.toastService.error(err.error?.message || 'Failed to create subscriber');
            }
        });
    }

    updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'PENDING') {
        if (confirm(`Change subscriber status to ${status}?`)) {
            this.subscriberService.updateSubscriberStatus(id, status).subscribe({
                next: () => this.toastService.success('Status updated successfully'),
                error: () => this.toastService.error('Failed to update status')
            });
        }
    }

    assignCodeToPending(subscriber: Subscriber) {
        if (!subscriber || subscriber.status !== 'PENDING') {
            this.toastService.error('Only pending subscribers can have codes assigned');
            return;
        }

        const availableCodes = this.availableCodes();
        if (availableCodes.length === 0) {
            this.toastService.error('No available codes. Please generate codes first.');
            return;
        }

        const codeId = availableCodes[0].id; // Use first available code
        this.subscriberService.assignCodeToPendingSubscriber(subscriber.id, codeId).subscribe({
            next: () => {
                this.toastService.success('Code assigned successfully');
                this.loadAvailableCodes();
            },
            error: (err: any) => {
                this.toastService.error(err.error?.message || 'Failed to assign code');
            }
        });
    }
}
