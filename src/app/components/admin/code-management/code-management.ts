import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberManagementService, SubscriberCode } from '../../../services/subscriber-management.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-code-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './code-management.html',
    styleUrl: './code-management.scss'
})
export class CodeManagementComponent implements OnInit {
    private subscriberService = inject(SubscriberManagementService);
    private toastService = inject(ToastService);
    private confirmationService = inject(ConfirmationService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    codes = this.subscriberService.codes;
    selectedFilter = signal<string>('all');
    selectedCodes = signal<Set<string>>(new Set());

    ngOnInit() {
        // Check for filter query parameter
        this.route.queryParams.subscribe(params => {
            const filter = params['filter'];
            if (filter) {
                // Map filter values
                const filterMap: { [key: string]: string } = {
                    'all': 'all',
                    'GENERATED': 'GENERATED',
                    'available': 'GENERATED'
                };
                const mappedFilter = filterMap[filter] || filter;
                this.selectedFilter.set(mappedFilter);
                this.filterCodes(mappedFilter);
            } else {
                this.subscriberService.getAllCodes().subscribe();
            }
        });
    }

    filterCodes(status: string) {
        this.selectedFilter.set(status);
        if (status === 'all') {
            this.subscriberService.getAllCodes().subscribe();
        } else {
            this.subscriberService.getAllCodes(status).subscribe();
        }
    }

    toggleCodeSelection(id: string) {
        const selected = new Set(this.selectedCodes());
        if (selected.has(id)) {
            selected.delete(id);
        } else {
            selected.add(id);
        }
        this.selectedCodes.set(selected);
    }

    downloadSelected() {
        const ids = Array.from(this.selectedCodes());
        if (ids.length === 0) {
            this.toastService.error('Please select at least one code');
            return;
        }

        this.subscriberService.downloadCodesPDF(undefined, ids).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-codes-${Date.now()}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => this.toastService.error('Failed to download PDF')
        });
    }

    revokeCode(id: string, code: string) {
        this.confirmationService.show({
            title: 'Confirmar Revocación',
            message: `¿Estás seguro de que deseas revocar el código <strong>${code}</strong>?<br><br><strong>Esta acción no se puede deshacer.</strong>`,
            confirmText: 'Revocar',
            cancelText: 'Cancelar',
            confirmButtonClass: 'danger'
        }).pipe(take(1)).subscribe((result: any) => {
            if (result.confirmed) {
                this.subscriberService.revokeCode(id).subscribe({
                    next: () => this.toastService.success('Code revoked successfully'),
                    error: () => this.toastService.error('Failed to revoke code')
                });
            }
        });
    }
}
