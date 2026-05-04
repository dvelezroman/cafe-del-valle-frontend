import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { ToastService } from '../../../services/toast.service';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  code?: { code: string; status: string };
  plan?: any;
  status: string;
  quotaRemaining?: number;
  quotaUsed?: number;
  originalPrice?: number;
  discountedPrice?: number;
  discounts?: any[];
  partnerProfile?: any;
}

@Component({
    selector: 'app-subscriber-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subscriber-management.html',
    styleUrl: './subscriber-management.scss'
})
export class SubscriberManagementComponent implements OnInit {
    private adminService = inject(AdminService);
    private subscriptionService = inject(SubscriptionService);
    private toastService = inject(ToastService);

    subscribers = signal<Subscriber[]>([]);
    plans = this.subscriptionService.plans;
    loading = signal(true);
    searchQuery = signal('');
    selectedStatus = signal<string>('');
  availableCodes = signal<any[]>([]);
  codeSearchTerm = signal<string>('');
  codeSearchTermAssign = signal<string>('');
  showCodeDropdown = signal<boolean>(false);
  showCodeDropdownAssign = signal<boolean>(false);

  // Computed signal for filtered codes (for create modal)
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

  // Computed signal for filtered codes (for assign modal)
  filteredCodesAssign = computed(() => {
    const searchTerm = this.codeSearchTermAssign().toLowerCase().trim();
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
  showPlanModal = signal(false);
  planChangeSubscriber = signal<Subscriber | null>(null);
  newPlanId = signal('');
  isUpdatingPlan = signal(false);

  formData = signal({
    codeId: '',
    name: '',
    email: '',
    phone: '',
    planId: '',
    notes: ''
  });

    ngOnInit() {
        this.loadSubscribers();
        this.subscriptionService.getAdminPlans().subscribe();
        this.loadAvailableCodes();
    }

    loadSubscribers() {
        this.loading.set(true);
        this.adminService.getSubscribers().subscribe({
            next: (subscribers: any[]) => {
                this.subscribers.set(subscribers || []);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    loadAvailableCodes() {
        this.adminService.getAllCodes('GENERATED').subscribe({
            next: (codes: any[]) => this.availableCodes.set(codes || [])
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
    this.codeSearchTermAssign.set('');
    this.showCodeDropdownAssign.set(false);
    this.formData.update(data => ({ ...data, codeId: '' }));
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

  selectCodeAssign(code: any) {
    this.formData.update(data => ({ ...data, codeId: code.id }));
    this.codeSearchTermAssign.set(code.code);
    this.showCodeDropdownAssign.set(false);
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

  onCodeInputFocusAssign() {
    this.showCodeDropdownAssign.set(true);
  }

  onCodeInputBlurAssign() {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      this.showCodeDropdownAssign.set(false);
    }, 200);
  }

  onCodeSearchChangeAssign(value: string) {
    this.codeSearchTermAssign.set(value);
    // Clear selection if search doesn't match
    const currentCode = this.formData().codeId;
    if (currentCode) {
      const code = this.availableCodes().find(c => c.id === currentCode);
      if (!code || !code.code.toLowerCase().includes(value.toLowerCase())) {
        this.formData.update(data => ({ ...data, codeId: '' }));
      }
    }
  }

  getCodeInputValueAssign(): string {
    const codeId = this.formData().codeId;
    if (codeId) {
      const code = this.availableCodes().find(c => c.id === codeId);
      return code ? code.code : this.codeSearchTermAssign();
    }
    return this.codeSearchTermAssign();
  }

  createSubscriber() {
    if (this.isCreating()) return;

    const data = this.formData();
    if (!data.codeId || !data.name || !data.email || !data.phone || !data.planId) {
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    this.isCreating.set(true);
    this.adminService.createSubscriber({
      codeId: data.codeId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      planId: data.planId,
      notes: data.notes
    }).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.toastService.success('Suscriptor creado correctamente');
        this.closeModal();
        this.loadAvailableCodes();
        this.loadSubscribers();
      },
      error: () => {
        this.isCreating.set(false);
        this.toastService.error('Error al crear el suscriptor');
      }
    });
  }

    updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'PENDING') {
        if (confirm(`¿Estás seguro de que deseas cambiar el estado del suscriptor a "${status}"?`)) {
            this.adminService.updateSubscriberStatus(id, status).subscribe({
                next: () => {
                    this.toastService.success('Estado actualizado correctamente');
                    this.loadSubscribers();
                },
                error: () => {
                    this.toastService.error('Error al actualizar el estado');
                }
            });
        }
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

        // Reset form data and search term for assignment modal
        this.formData.update(data => ({ ...data, codeId: '' }));
        this.codeSearchTermAssign.set('');
        this.showCodeDropdownAssign.set(false);

        // Open modal to select code
        this.selectedSubscriber.set(subscriber);
        this.showCodeAssignmentModal.set(true);
    }

    openPlanModal(sub: Subscriber) {
        this.planChangeSubscriber.set(sub);
        this.newPlanId.set(sub.plan?.id || '');
        this.showPlanModal.set(true);
    }

    closePlanModal() {
        this.showPlanModal.set(false);
        this.planChangeSubscriber.set(null);
        this.newPlanId.set('');
    }

    savePlanChange() {
        const sub = this.planChangeSubscriber();
        const pid = this.newPlanId();
        if (!sub || !pid) {
            this.toastService.error('Selecciona un plan');
            return;
        }
        this.isUpdatingPlan.set(true);
        this.adminService.updateSubscriberPlan(sub.id, pid).subscribe({
            next: () => {
                this.isUpdatingPlan.set(false);
                this.toastService.success('Plan actualizado');
                this.closePlanModal();
                this.loadSubscribers();
            },
            error: () => {
                this.isUpdatingPlan.set(false);
            },
        });
    }

    assignSelectedCode(codeId: string) {
        const subscriber = this.selectedSubscriber();
        if (!subscriber || !codeId) {
            this.toastService.error('Por favor selecciona un código');
            return;
        }

        this.isAssigningCode.set(true);
        this.adminService.assignCodeToSubscriber(subscriber.id, codeId).subscribe({
            next: () => {
                this.isAssigningCode.set(false);
                this.toastService.success('Código asignado correctamente');
                this.closeCodeAssignmentModal();
                this.loadAvailableCodes();
                this.loadSubscribers();
            },
            error: () => {
                this.isAssigningCode.set(false);
                this.toastService.error('Error al asignar el código');
            }
        });
    }
}
