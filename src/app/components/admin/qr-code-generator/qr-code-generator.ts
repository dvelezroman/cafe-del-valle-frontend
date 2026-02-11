import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberManagementService } from '../../../services/subscriber-management.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-qr-code-generator',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './qr-code-generator.html',
    styleUrl: './qr-code-generator.scss'
})
export class QrCodeGeneratorComponent implements OnInit {
    private subscriberService = inject(SubscriberManagementService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    stats = this.subscriberService.codeStats;
    codes = this.subscriberService.codes;
    isGenerating = signal(false);
    isDownloading = signal(false);
    showPreview = signal(false);

    formData = signal({
        quantity: 10,
        prefix: 'CDV-2026-'
    });

    ngOnInit() {
        this.subscriberService.getCodeStats().subscribe();
        this.subscriberService.getAllCodes('GENERATED').subscribe();
    }

    generateCodes() {
        const data = this.formData();
        if (data.quantity < 1 || data.quantity > 500) {
            this.toastService.error('Quantity must be between 1 and 500');
            return;
        }

        this.isGenerating.set(true);
        this.subscriberService.generateCodes(data.quantity, data.prefix).subscribe({
            next: () => {
                this.isGenerating.set(false);
                this.showPreview.set(true);
                this.subscriberService.getCodeStats().subscribe();
                this.subscriberService.getAllCodes('GENERATED').subscribe();
            },
            error: () => {
                this.isGenerating.set(false);
                this.toastService.error('Failed to generate codes');
            }
        });
    }

    downloadPDF() {
        this.isDownloading.set(true);
        this.subscriberService.downloadCodesPDF('GENERATED').subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-codes-${Date.now()}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.isDownloading.set(false);
            },
            error: () => {
                this.isDownloading.set(false);
                this.toastService.error('Failed to download PDF');
            }
        });
    }

    downloadSelectedPDF(selectedIds: string[]) {
        if (selectedIds.length === 0) {
            this.toastService.error('Please select at least one code');
            return;
        }

        this.isDownloading.set(true);
        this.subscriberService.downloadCodesPDF(undefined, selectedIds).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-codes-selected-${Date.now()}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.isDownloading.set(false);
            },
            error: () => {
                this.isDownloading.set(false);
                alert('Failed to download PDF');
            }
        });
    }

    navigateToCodes(filter?: string) {
        const queryParams: any = {};
        if (filter) {
            queryParams.filter = filter;
        }
        this.router.navigate(['/admin/dashboard/codes'], { queryParams });
    }
}
