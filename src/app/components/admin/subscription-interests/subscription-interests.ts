import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
    selector: 'app-subscription-interests',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './subscription-interests.html',
    styleUrl: './subscription-interests.scss'
})
export class SubscriptionInterestsComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);

    interests = this.subscriptionService.interests;

    ngOnInit() {
        this.subscriptionService.getAdminInterests().subscribe();
    }
}
