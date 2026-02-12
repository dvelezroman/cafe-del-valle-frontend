import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface ConsumptionRecord {
    id: string;
    partnerId: string;
    promotionId?: string;
    productName?: string;
    pointsUsed: number;
    pointsEarned: number;
    createdAt: string;
    partner: {
        id: string;
        user: {
            name: string;
            email: string;
        };
        referralCode: string;
        points: number;
    };
    promotion?: {
        id: string;
        name: { es: string; en: string };
        pointsCost: number;
    };
}

export interface Partner {
    id: string;
    user: {
        name: string;
        email: string;
    };
    referralCode: string;
    points: number;
    status: string;
}

@Component({
    selector: 'app-partner-redemption-history',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './partner-redemption-history.html',
    styleUrl: './partner-redemption-history.scss'
})
export class PartnerRedemptionHistoryComponent implements OnInit {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}`;

    consumptionRecords = signal<ConsumptionRecord[]>([]);
    partners = signal<Partner[]>([]);
    isLoading = signal(false);
    
    // Filters
    selectedPartnerId = signal<string>('');
    
    // Computed
    filteredRecords = computed(() => {
        let records = this.consumptionRecords();
        
        if (this.selectedPartnerId()) {
            records = records.filter(r => r.partnerId === this.selectedPartnerId());
        }
        
        return records;
    });

    ngOnInit() {
        this.loadConsumptionRecords();
        this.loadPartners();
    }

    loadConsumptionRecords() {
        this.isLoading.set(true);
        const partnerId = this.selectedPartnerId() || undefined;
        
        const params: any = {};
        if (partnerId) params.partnerId = partnerId;

        this.http.get<ConsumptionRecord[]>(`${this.baseUrl}/admin/consumption-records`, { params }).subscribe({
            next: (records) => {
                this.consumptionRecords.set(records);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    loadPartners() {
        this.http.get<Partner[]>(`${this.baseUrl}/admin/partners`).subscribe({
            next: (partners) => {
                this.partners.set(partners);
            }
        });
    }

    onPartnerFilterChange() {
        this.loadConsumptionRecords();
    }

    clearFilters() {
        this.selectedPartnerId.set('');
        this.loadConsumptionRecords();
    }

    getPartnerName(partnerId: string): string {
        const partner = this.partners().find(p => p.id === partnerId);
        return partner?.user.name || 'Unknown';
    }

    getTotalPointsUsed(): number {
        return this.filteredRecords().reduce((sum, record) => sum + record.pointsUsed, 0);
    }

    getTotalPointsEarned(): number {
        return this.filteredRecords().reduce((sum, record) => sum + record.pointsEarned, 0);
    }
}
