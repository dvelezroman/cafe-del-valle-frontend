import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriberManagementService, SubscriberCode } from '../../../services/subscriber-management.service';

@Component({
    selector: 'app-code-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './code-management.html',
    styleUrl: './code-management.scss'
})
export class CodeManagementComponent implements OnInit {
    private subscriberService = inject(SubscriberManagementService);

    codes = this.subscriberService.codes;
    selectedFilter = signal<string>('all');
    selectedCodes = signal<Set<string>>(new Set());

    ngOnInit() {
        this.subscriberService.getAllCodes().subscribe();
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
            alert('Please select at least one code');
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
            error: () => alert('Failed to download PDF')
        });
    }

    revokeCode(id: string, code: string) {
        if (confirm(`Are you sure you want to revoke code ${code}?`)) {
            this.subscriberService.revokeCode(id).subscribe({
                error: () => alert('Failed to revoke code')
            });
        }
    }
}
