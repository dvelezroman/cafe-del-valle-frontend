import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface SubscriptionInterest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  planId: string;
  plan?: any;
  status: 'PENDING' | 'CONTACTED' | 'CONVERTED';
  notes?: string;
  createdAt: string;
}

@Component({
    selector: 'app-subscription-interests',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './subscription-interests.html',
    styleUrl: './subscription-interests.scss'
})
export class SubscriptionInterestsComponent implements OnInit {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);

    interests = signal<SubscriptionInterest[]>([]);
    loading = signal(true);
    searchTerm = signal('');
    selectedStatus = signal<string>('');
    showEditModal = signal(false);
    selectedInterest = signal<SubscriptionInterest | null>(null);
    isSaving = signal(false);
    
    notesInput = '';

    filteredInterests = computed(() => {
        let items = this.interests();
        const term = this.searchTerm().toLowerCase();
        
        if (term) {
            items = items.filter(i =>
                i.name.toLowerCase().includes(term) ||
                i.email.toLowerCase().includes(term) ||
                i.phone?.toLowerCase().includes(term)
            );
        }
        
        if (this.selectedStatus()) {
            items = items.filter(i => i.status === this.selectedStatus());
        }
        
        return items.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    totalLeads = computed(() => this.interests().length);
    pendingLeads = computed(() => this.interests().filter(i => i.status === 'PENDING').length);
    contactedLeads = computed(() => this.interests().filter(i => i.status === 'CONTACTED').length);
    convertedLeads = computed(() => this.interests().filter(i => i.status === 'CONVERTED').length);

    ngOnInit() {
        this.loadInterests();
    }

    loadInterests() {
        this.loading.set(true);
        this.adminService.getSubscriptionInterests().subscribe({
            next: (interests: any[]) => {
                this.interests.set(interests || []);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    openEditModal(interest: SubscriptionInterest) {
        this.selectedInterest.set(interest);
        this.notesInput = interest.notes || '';
        this.showEditModal.set(true);
    }

    closeEditModal() {
        this.showEditModal.set(false);
        this.selectedInterest.set(null);
        this.notesInput = '';
    }

    updateStatus(id: string, status: 'PENDING' | 'CONTACTED' | 'CONVERTED') {
        const interest = this.interests().find(i => i.id === id);
        if (!interest) return;

        this.adminService.updateSubscriptionInterest(id, { status, notes: interest.notes }).subscribe({
            next: () => {
                this.toastService.success(`Lead marcado como ${status === 'CONTACTED' ? 'contactado' : status === 'CONVERTED' ? 'convertido' : 'pendiente'}`);
                this.loadInterests();
            },
            error: () => {
                this.toastService.error('Error al actualizar el estado');
            }
        });
    }

    markAsContacted(id: string) {
        this.updateStatus(id, 'CONTACTED');
    }

    saveNotes() {
        const interest = this.selectedInterest();
        if (!interest || this.isSaving()) return;

        this.isSaving.set(true);
        this.adminService.updateSubscriptionInterest(interest.id, {
            status: interest.status,
            notes: this.notesInput.trim()
        }).subscribe({
            next: () => {
                this.isSaving.set(false);
                this.toastService.success('Notas actualizadas correctamente');
                this.closeEditModal();
                this.loadInterests();
            },
            error: () => {
                this.isSaving.set(false);
                this.toastService.error('Error al actualizar las notas');
            }
        });
    }

    bulkUpdateStatus(status: 'PENDING' | 'CONTACTED' | 'CONVERTED') {
        const itemsToUpdate = this.filteredInterests().filter(i => i.status !== status);
        if (itemsToUpdate.length === 0) {
            this.toastService.error('No hay leads para actualizar');
            return;
        }

        if (confirm(`¿Actualizar ${itemsToUpdate.length} lead(s) a estado "${status}"?`)) {
            let completed = 0;
            itemsToUpdate.forEach(item => {
                this.adminService.updateSubscriptionInterest(item.id, { status, notes: item.notes }).subscribe({
                    next: () => {
                        completed++;
                        if (completed === itemsToUpdate.length) {
                            this.toastService.success(`${completed} lead(s) actualizado(s)`);
                            this.loadInterests();
                        }
                    },
                    error: () => {
                        completed++;
                        if (completed === itemsToUpdate.length) {
                            this.loadInterests();
                        }
                    }
                });
            });
        }
    }

    exportLeads() {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Plan', 'Estado', 'Notas', 'Fecha'];
        const rows = this.filteredInterests().map(i => [
            i.name,
            i.email,
            i.phone ?? '',
            i.plan?.title?.es ?? i.planId,
            i.status,
            i.notes ?? '',
            new Date(i.createdAt).toLocaleDateString()
        ]);
        const data = [headers, ...rows];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, `leads-${new Date().toISOString().split('T')[0]}.xlsx`);
        this.toastService.success('Leads exportados correctamente');
    }
}
