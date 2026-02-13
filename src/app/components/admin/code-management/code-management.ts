import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface SubscriberCode {
  id: string;
  code: string;
  status: 'GENERATED' | 'ASSIGNED' | 'REVOKED';
  subscriber?: {
    name: string;
    email: string;
  };
  generatedAt: string;
  assignedAt?: string;
  revokedAt?: string;
}

@Component({
    selector: 'app-code-management',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './code-management.html',
    styleUrl: './code-management.scss'
})
export class CodeManagementComponent implements OnInit {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    codes = signal<SubscriberCode[]>([]);
    loading = signal(true);
    selectedFilter = signal<string>('all');
    selectedCodes = signal<Set<string>>(new Set());
    searchQuery = signal('');

    filteredCodes = computed(() => {
        let items = this.codes();
        const query = this.searchQuery().toLowerCase();
        
        if (query) {
            items = items.filter(c => 
                c.code.toLowerCase().includes(query) ||
                c.subscriber?.name.toLowerCase().includes(query) ||
                c.subscriber?.email.toLowerCase().includes(query)
            );
        }
        
        return items.sort((a, b) => 
            new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        );
    });

    stats = computed(() => {
        const all = this.codes();
        return {
            total: all.length,
            available: all.filter(c => c.status === 'GENERATED').length,
            assigned: all.filter(c => c.status === 'ASSIGNED').length,
            revoked: all.filter(c => c.status === 'REVOKED').length
        };
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const filter = params['filter'];
            if (filter) {
                const filterMap: { [key: string]: string } = {
                    'all': 'all',
                    'GENERATED': 'GENERATED',
                    'ASSIGNED': 'ASSIGNED',
                    'REVOKED': 'REVOKED',
                    'available': 'GENERATED'
                };
                const mappedFilter = filterMap[filter] || filter;
                this.selectedFilter.set(mappedFilter);
                this.loadCodes(mappedFilter === 'all' ? undefined : mappedFilter);
            } else {
                this.loadCodes();
            }
        });
    }

    loadCodes(status?: string) {
        this.loading.set(true);
        this.adminService.getAllCodes(status).subscribe({
            next: (codes: any[]) => {
                this.codes.set(codes || []);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    filterCodes(status: string) {
        this.selectedFilter.set(status);
        this.loadCodes(status === 'all' ? undefined : status);
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

    toggleAllSelection() {
        const filtered = this.filteredCodes();
        const selected = this.selectedCodes();
        const allSelected = filtered.every(c => selected.has(c.id) && c.status === 'GENERATED');
        
        if (allSelected) {
            filtered.forEach(c => {
                if (c.status === 'GENERATED') selected.delete(c.id);
            });
        } else {
            filtered.forEach(c => {
                if (c.status === 'GENERATED') selected.add(c.id);
            });
        }
        this.selectedCodes.set(new Set(selected));
    }

    downloadSelected() {
        const ids = Array.from(this.selectedCodes());
        if (ids.length === 0) {
            this.toastService.error('Selecciona al menos un código');
            return;
        }

        this.adminService.downloadCodesPDF(ids).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-codes-${Date.now()}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.toastService.success('PDF descargado correctamente');
            },
            error: () => {
                this.toastService.error('Error al descargar el PDF');
            }
        });
    }

    revokeCode(id: string, code: string) {
        if (confirm(`¿Estás seguro de que deseas revocar el código "${code}"?\n\nEsta acción no se puede deshacer.`)) {
            this.adminService.revokeCode(id).subscribe({
                next: () => {
                    this.toastService.success('Código revocado correctamente');
                    this.loadCodes(this.selectedFilter() === 'all' ? undefined : this.selectedFilter());
                },
                error: () => {
                    this.toastService.error('Error al revocar el código');
                }
            });
        }
    }

    areAllSelected(): boolean {
        const filtered = this.filteredCodes();
        const generated = filtered.filter(c => c.status === 'GENERATED');
        if (generated.length === 0) return false;
        return generated.every(c => this.selectedCodes().has(c.id));
    }

    hasNoGeneratedCodes(): boolean {
        return this.filteredCodes().filter(c => c.status === 'GENERATED').length === 0;
    }

    bulkRevoke() {
        const ids = Array.from(this.selectedCodes());
        if (ids.length === 0) {
            this.toastService.error('Selecciona al menos un código');
            return;
        }

        if (confirm(`¿Estás seguro de que deseas revocar ${ids.length} código(s)?\n\nEsta acción no se puede deshacer.`)) {
            let completed = 0;
            ids.forEach(id => {
                this.adminService.revokeCode(id).subscribe({
                    next: () => {
                        completed++;
                        if (completed === ids.length) {
                            this.toastService.success(`${completed} código(s) revocado(s)`);
                            this.selectedCodes.set(new Set());
                            this.loadCodes(this.selectedFilter() === 'all' ? undefined : this.selectedFilter());
                        }
                    },
                    error: () => {
                        completed++;
                        if (completed === ids.length) {
                            this.loadCodes(this.selectedFilter() === 'all' ? undefined : this.selectedFilter());
                        }
                    }
                });
            });
        }
    }

    exportCodes() {
        const csv = [
            ['Código', 'Estado', 'Asignado a', 'Email', 'Fecha Generación', 'Fecha Asignación'].join(','),
            ...this.filteredCodes().map(c => [
                `"${c.code}"`,
                `"${c.status}"`,
                `"${c.subscriber?.name || ''}"`,
                `"${c.subscriber?.email || ''}"`,
                `"${new Date(c.generatedAt).toLocaleDateString()}"`,
                `"${c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `codigos-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        this.toastService.success('Códigos exportados correctamente');
    }
}
