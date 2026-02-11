import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../services/subscription.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-subscription-interests',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscription-interests.html',
    styleUrl: './subscription-interests.scss'
})
export class SubscriptionInterestsComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);
    private confirmationService = inject(ConfirmationService);

    interests = this.subscriptionService.interests;
    searchTerm = signal('');

    filteredInterests = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.interests().filter(i =>
            i.name.toLowerCase().includes(term) ||
            i.email.toLowerCase().includes(term)
        );
    });

    totalLeads = computed(() => this.interests().length);
    pendingLeads = computed(() => this.interests().filter(i => i.status !== 'CONTACTED').length);

    ngOnInit() {
        this.subscriptionService.getAdminInterests().subscribe();
    }

    markAsContacted(id: string) {
        this.confirmationService.show({
            title: 'Confirmar',
            message: '¿Marcar este lead como contactado?',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmButtonClass: 'primary'
        }).pipe(take(1)).subscribe((result: any) => {
            if (result.confirmed) {
                this.subscriptionService.updateInterestStatus(id, 'CONTACTED').subscribe();
            }
        });
    }
}
