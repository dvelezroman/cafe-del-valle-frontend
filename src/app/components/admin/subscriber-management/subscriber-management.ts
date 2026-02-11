import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriberManagementService, Subscriber } from '../../../services/subscriber-management.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-subscriber-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscriber-management.html',
    styleUrl: './subscriber-management.scss'
})
export class SubscriberManagementComponent implements OnInit {
    private subscriberService = inject(SubscriberManagementService);
    private subscriptionService = inject(SubscriptionService);
    private toastService = inject(ToastService);
    private confirmationService = inject(ConfirmationService);

    subscribers = this.subscriberService.subscribers;
    plans = this.subscriptionService.plans;
  availableCodes = signal<any[]>([]);
  codeSearchTerm = signal<string>('');
  showCodeDropdown = signal<boolean>(false);

  // Computed signal for filtered codes
  filteredCodes = computed(() => {
    const searchTerm = this.codeSearchTerm().toLowerCase().trim();
    const codes = this.availableCodes();
    
    if (!searchTerm) {
      return codes;
    }
    
    return codes.filter(code => 
      code.code.toLowerCase().includes(searchTerm)
    );
  });

  isModalOpen = signal(false);
  showCodeAssignmentModal = signal(false);
  selectedSubscriber = signal<Subscriber | null>(null);
  isCreating = signal(false);
  isAssigningCode = signal(false);

  formData = signal({
    codeId: '',
    name: '',
    email: '',
    phone: '',
    planId: '',
    notes: ''
  });

    ngOnInit() {
        this.subscriberService.getAllSubscribers().subscribe();
        this.subscriptionService.getAdminPlans().subscribe();
        this.loadAvailableCodes();
    }

    loadAvailableCodes() {
        this.subscriberService.getAllCodes('GENERATED').subscribe({
            next: (codes) => this.availableCodes.set(codes)
        });
    }

  openCreateModal() {
    this.selectedSubscriber.set(null);
    this.resetForm();
    this.codeSearchTerm.set('');
    this.showCodeDropdown.set(false);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.codeSearchTerm.set('');
    this.showCodeDropdown.set(false);
  }

  closeCodeAssignmentModal() {
    this.showCodeAssignmentModal.set(false);
    this.selectedSubscriber.set(null);
    this.codeSearchTerm.set('');
    this.showCodeDropdown.set(false);
  }

  resetForm() {
    this.formData.set({
      codeId: '',
      name: '',
      email: '',
      phone: '',
      planId: '',
      notes: ''
    });
    this.codeSearchTerm.set('');
    this.showCodeDropdown.set(false);
  }

  onCodeSearchChange(searchTerm: string) {
    this.codeSearchTerm.set(searchTerm);
    this.showCodeDropdown.set(true);
    // Clear selected code if it's not in filtered results
    const filtered = this.filteredCodes();
    const currentCodeId = this.formData().codeId;
    if (currentCodeId && !filtered.find(c => c.id === currentCodeId)) {
      this.formData.update(data => ({ ...data, codeId: '' }));
    }
  }

  getCodeInputValue(): string {
    if (this.codeSearchTerm()) {
      return this.codeSearchTerm();
    }
    const codeId = this.formData().codeId;
    if (codeId) {
      const code = this.availableCodes().find(c => c.id === codeId);
      return code?.code || '';
    }
    return '';
  }

  selectCode(code: any) {
    this.formData.update(data => ({ ...data, codeId: code.id }));
    this.codeSearchTerm.set(code.code);
    this.showCodeDropdown.set(false);
  }

  onCodeInputFocus() {
    this.showCodeDropdown.set(true);
  }

  onCodeInputBlur() {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      this.showCodeDropdown.set(false);
    }, 200);
  }

  createSubscriber() {
    if (this.isCreating()) return; // Prevent double submission

    const data = this.formData();
    if (!data.codeId || !data.name || !data.email || !data.phone || !data.planId) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.isCreating.set(true);
    this.subscriberService.createSubscriber(data).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.closeModal();
        this.loadAvailableCodes();
      },
      error: (err: any) => {
        this.isCreating.set(false);
        this.toastService.error(err.error?.message || 'Failed to create subscriber');
      }
    });
  }

    updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'PENDING') {
        this.confirmationService.show({
            title: 'Confirmar Cambio de Estado',
            message: `¿Estás seguro de que deseas cambiar el estado del suscriptor a <strong>${status}</strong>?`,
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmButtonClass: 'primary'
        }).pipe(take(1)).subscribe((result: any) => {
            if (result.confirmed) {
                this.subscriberService.updateSubscriberStatus(id, status).subscribe({
                    next: () => this.toastService.success('Status updated successfully'),
                    error: () => this.toastService.error('Failed to update status')
                });
            }
        });
    }

    assignCodeToPending(subscriber: Subscriber) {
        // Allow assignment if subscriber is PENDING or has a revoked code
        const hasRevokedCode = subscriber.code && subscriber.code.status === 'REVOKED';
        const canAssign = subscriber.status === 'PENDING' || hasRevokedCode;

        if (!subscriber || !canAssign) {
            this.toastService.error('Only pending subscribers or subscribers with revoked codes can have codes assigned');
            return;
        }

        const availableCodes = this.availableCodes();
        if (availableCodes.length === 0) {
            this.toastService.error('No available codes. Please generate codes first.');
            return;
        }

        // Open modal to select code
        this.selectedSubscriber.set(subscriber);
        this.showCodeAssignmentModal.set(true);
    }

    assignSelectedCode(codeId: string) {
        const subscriber = this.selectedSubscriber();
        if (!subscriber || !codeId) {
            this.toastService.error('Please select a code');
            return;
        }

        this.isAssigningCode.set(true);
        this.subscriberService.assignCodeToPendingSubscriber(subscriber.id, codeId).subscribe({
            next: () => {
                this.isAssigningCode.set(false);
                this.toastService.success('Code assigned successfully');
                this.closeCodeAssignmentModal();
                this.loadAvailableCodes();
                this.subscriberService.getAllSubscribers().subscribe();
            },
            error: (err: any) => {
                this.isAssigningCode.set(false);
                this.toastService.error(err.error?.message || 'Failed to assign code');
            }
        });
    }
}
