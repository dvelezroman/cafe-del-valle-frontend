import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-qr-code-generator',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './qr-code-generator.html',
    styleUrl: './qr-code-generator.scss'
})
export class QrCodeGeneratorComponent implements OnInit {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    stats = signal<any>({ total: 0, available: 0, assigned: 0, revoked: 0 });
    codes = signal<any[]>([]);
    isGenerating = signal(false);
    isDownloading = signal(false);
    showPreview = signal(false);

    formData = signal({
        quantity: 10,
        prefix: 'CDV-2026-'
    });

    ngOnInit() {
        this.loadStats();
        this.loadCodes();
    }

    loadStats() {
        this.adminService.getCodeStats().subscribe({
            next: (stats: any) => {
                this.stats.set(stats || { total: 0, available: 0, assigned: 0, revoked: 0 });
            }
        });
    }

    loadCodes() {
        this.adminService.getAllCodes('GENERATED').subscribe({
            next: (codes: any[]) => {
                this.codes.set(codes || []);
            }
        });
    }

    generateCodes() {
        const data = this.formData();
        if (data.quantity < 1 || data.quantity > 500) {
            this.toastService.error('La cantidad debe estar entre 1 y 500');
            return;
        }

        this.isGenerating.set(true);
        this.adminService.generateCodes(data.quantity, data.prefix).subscribe({
            next: () => {
                this.isGenerating.set(false);
                this.toastService.success(`${data.quantity} código(s) generado(s) correctamente`);
                this.showPreview.set(true);
                this.loadStats();
                this.loadCodes();
            },
            error: () => {
                this.isGenerating.set(false);
                this.toastService.error('Error al generar códigos');
            }
        });
    }

    downloadPDF() {
        this.isDownloading.set(true);
        this.adminService.downloadCodesPDF().subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-codes-${Date.now()}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.isDownloading.set(false);
                this.toastService.success('PDF descargado correctamente');
            },
            error: () => {
                this.isDownloading.set(false);
                this.toastService.error('Error al descargar el PDF');
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
