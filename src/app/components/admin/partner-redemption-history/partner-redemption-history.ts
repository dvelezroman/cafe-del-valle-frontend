import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

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
    imports: [CommonModule, FormsModule],
    templateUrl: './partner-redemption-history.html',
    styleUrl: './partner-redemption-history.scss'
})
export class PartnerRedemptionHistoryComponent implements OnInit {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);

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

        if (partnerId) {
            this.adminService.getPartnerConsumption(partnerId).subscribe({
                next: (records: any[]) => {
                    this.consumptionRecords.set(records || []);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
        } else {
            // Load all consumption records - get from all partners
            this.adminService.getAllPartners().subscribe({
                next: (partners: any[]) => {
                    const approvedPartners = (partners || []).filter((p: any) => p.status === 'APPROVED');
                    const allRecords: any[] = [];
                    let loaded = 0;
                    
                    if (approvedPartners.length === 0) {
                        this.consumptionRecords.set([]);
                        this.isLoading.set(false);
                        return;
                    }
                    
                    approvedPartners.forEach((partner: any) => {
                        this.adminService.getPartnerConsumption(partner.id).subscribe({
                            next: (records: any[]) => {
                                allRecords.push(...(records || []));
                                loaded++;
                                if (loaded === approvedPartners.length) {
                                    this.consumptionRecords.set(allRecords);
                                    this.isLoading.set(false);
                                }
                            },
                            error: () => {
                                loaded++;
                                if (loaded === approvedPartners.length) {
                                    this.consumptionRecords.set(allRecords);
                                    this.isLoading.set(false);
                                }
                            }
                        });
                    });
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
        }
    }

    loadPartners() {
        this.adminService.getAllPartners().subscribe({
            next: (partners: any[]) => {
                this.partners.set((partners || []).filter((p: any) => p.status === 'APPROVED'));
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

    exportHistory() {
        const csv = [
            ['Fecha', 'Socio', 'Email', 'Código Referido', 'Promoción/Producto', 'Puntos Usados', 'Puntos Ganados', 'Puntos Netos'].join(','),
            ...this.filteredRecords().map(r => [
                `"${new Date(r.createdAt).toLocaleString()}"`,
                `"${r.partner.user.name}"`,
                `"${r.partner.user.email}"`,
                `"${r.partner.referralCode}"`,
                `"${r.promotion?.name?.es || r.promotion?.name?.en || r.productName || ''}"`,
                `"${r.pointsUsed}"`,
                `"${r.pointsEarned}"`,
                `"${r.pointsEarned - r.pointsUsed}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `historial-socios-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        this.toastService.success('Historial exportado correctamente');
    }
}
