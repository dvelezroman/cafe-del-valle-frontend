import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, SubscriptionPlan } from '../../services/subscription.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-subscription-plans-public',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscription-plans-public.html',
    styleUrl: './subscription-plans-public.scss'
})
export class SubscriptionPlansPublicComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);

    plans = signal<SubscriptionPlan[]>([]);
    isModalOpen = signal(false);
    selectedPlan = signal<SubscriptionPlan | null>(null);

    // Interest Form Data
    formData = signal({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    isSubmitting = signal(false);
    submitSuccess = signal(false);

    ngOnInit() {
        this.subscriptionService.getPublicPlans().subscribe(plans => {
            this.plans.set(plans);
        });
    }

    openInterestModal(plan: SubscriptionPlan) {
        this.selectedPlan.set(plan);
        this.isModalOpen.set(true);
        this.submitSuccess.set(false);
        this.formData.set({ name: '', email: '', phone: '', notes: '' });
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    submitInterest() {
        const plan = this.selectedPlan();
        if (!plan) return;

        this.isSubmitting.set(true);
        const data = {
            ...this.formData(),
            planId: plan.id
        };

        console.log('Submitting interest:', data);

        this.subscriptionService.submitInterest(data).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.submitSuccess.set(true);
                setTimeout(() => this.closeModal(), 3000); // Close after 3s
            },
            error: (err) => {
                console.error('Error submitting interest', err);
                this.isSubmitting.set(false);
                alert('Could not submit your interest. Please try again.');
            }
        });
    }
}
