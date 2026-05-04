import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService, SubscriptionPlan } from '../../services/subscription.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-subscription-plans-public',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './subscription-plans-public.html',
    styleUrl: './subscription-plans-public.scss'
})
export class SubscriptionPlansPublicComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    public translationService = inject(TranslationService);

    plans = signal<SubscriptionPlan[]>([]);
    isModalOpen = signal(false);
    selectedPlan = signal<SubscriptionPlan | null>(null);

    getPlanFeatures(plan: SubscriptionPlan): string[] {
        if (!plan.features) {
            return [];
        }
        
        // If it's already an array, return it
        if (Array.isArray(plan.features)) {
            return plan.features;
        }
        
        // If it's an object with language keys, extract the current language
        const lang = this.translationService.getCurrentLanguageValue();
        const features = plan.features as any;
        
        if (features && typeof features === 'object') {
            // Try current language first, then fallback to 'es', then any available
            return features[lang] || features['es'] || features['en'] || features['fr'] || [];
        }
        
        return [];
    }

    getBillingPeriodLabel(plan: SubscriptionPlan): string {
        const lang = this.translationService.getCurrentLanguageValue();
        
        if (plan.billingPeriod === 'MONTHLY') {
            return lang === 'es' ? '/ mes' : lang === 'en' ? '/ month' : '/ mois';
        }
        
        if (plan.billingPeriod === 'YEARLY') {
            return lang === 'es' ? '/ año' : lang === 'en' ? '/ year' : '/ an';
        }
        
        if (plan.billingPeriod === 'CUSTOM' && plan.billingDurationLabel) {
            const label = plan.billingDurationLabel as any;
            return label[lang] || label['es'] || label['en'] || '';
        }
        
        // Fallback
        return lang === 'es' ? '/ mes' : '/ month';
    }

    getPlanTitle(plan: SubscriptionPlan): string {
        const lang = this.translationService.getCurrentLanguageValue();
        if (plan.title && typeof plan.title === 'object') {
            return (plan.title as any)[lang] || (plan.title as any)['es'] || '';
        }
        return plan.title as string || '';
    }

    getPlanDescription(plan: SubscriptionPlan): string {
        const lang = this.translationService.getCurrentLanguageValue();
        if (plan.description && typeof plan.description === 'object') {
            return (plan.description as any)[lang] || (plan.description as any)['es'] || '';
        }
        return plan.description as string || '';
    }

    // Interest Form Data
    formData = signal({
        name: '',
        email: '',
        phone: '',
        idNumber: '',
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
        this.formData.set({ name: '', email: '', phone: '', idNumber: '', notes: '' });
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
                setTimeout(() => this.closeModal(), 8000);
            },
            error: (err) => {
                console.error('Error submitting interest', err);
                this.isSubmitting.set(false);
                const errorMsg = this.translate('subscriptions.modal.error') || 'Could not submit your interest. Please try again.';
                this.toastService.error(errorMsg);
            }
        });
    }

    translate(key: string, params?: { [key: string]: string }): string {
        return this.translationService.translate(key, params);
    }

    /** Solo en ruta dedicada (p. ej. /solicitud-socio); oculto cuando el bloque está embebido en la home. */
    showBackToHome(): boolean {
        const path = this.router.url.split(/[?#]/)[0];
        return path !== '/';
    }
}
