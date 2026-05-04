import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { SubscriptionService, SubscriptionPlan } from '../../../services/subscription.service';

@Component({
    selector: 'app-membership-queue',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './membership-queue.html',
    styleUrl: './membership-queue.scss',
})
export class MembershipQueueComponent implements OnInit {
    private admin = inject(AdminService);
    private toast = inject(ToastService);
    private subscriptionService = inject(SubscriptionService);

    queue = signal<{ applications: any[]; pendingPartners: any[] } | null>(null);
    loading = signal(true);
    plans = signal<SubscriptionPlan[]>([]);

    convertApp: any = null;
    convertPassword = '';
    convertPlanId = '';
    converting = false;

    approvePartner: any = null;
    approvePlanId = '';
    approving = false;

    readonly appStatuses = ['PENDING', 'CONTACTED', 'PAYMENT_PENDING', 'REJECTED', 'CONVERTED'] as const;

    ngOnInit() {
        this.subscriptionService.getAdminPlans().subscribe((p) => this.plans.set(p.filter((x) => x.active)));
        this.reload();
    }

    reload() {
        this.loading.set(true);
        this.admin.getMembershipQueue().subscribe({
            next: (q) => {
                this.queue.set(q);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    updateApplicationStatus(row: any, status: string) {
        this.admin.updateSubscriptionInterest(row.id, { status, notes: row.notes }).subscribe({
            next: () => {
                this.toast.success('Solicitud actualizada');
                this.reload();
            },
            error: () => {},
        });
    }

    openConvert(app: any) {
        this.convertApp = app;
        this.convertPassword = '';
        this.convertPlanId = app.planId;
    }

    closeConvert() {
        this.convertApp = null;
    }

    submitConvert() {
        if (!this.convertApp) return;
        if (this.convertPassword.length < 8) {
            this.toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (!this.convertPlanId) {
            this.toast.error('Selecciona un plan');
            return;
        }
        this.converting = true;
        this.admin
            .convertMembershipApplication(this.convertApp.id, {
                password: this.convertPassword,
                planId: this.convertPlanId,
            })
            .subscribe({
                next: () => {
                    this.converting = false;
                    this.toast.success('Socio creado y suscripción activada');
                    this.closeConvert();
                    this.reload();
                },
                error: () => {
                    this.converting = false;
                },
            });
    }

    openApprove(p: any) {
        this.approvePartner = p;
        this.approvePlanId = '';
    }

    closeApprove() {
        this.approvePartner = null;
        this.approvePlanId = '';
    }

    submitApprove() {
        if (!this.approvePartner || !this.approvePlanId) {
            this.toast.error('Selecciona un plan');
            return;
        }
        this.approving = true;
        this.admin
            .validatePartner(this.approvePartner.id, {
                status: 'APPROVED',
                planId: this.approvePlanId,
                referralPoints: 50,
            })
            .subscribe({
                next: () => {
                    this.approving = false;
                    this.toast.success('Socio aprobado');
                    this.closeApprove();
                    this.reload();
                },
                error: () => {
                    this.approving = false;
                },
            });
    }

    rejectPartner(p: any) {
        if (!confirm('¿Rechazar esta solicitud de socio?')) return;
        this.admin.validatePartner(p.id, { status: 'REJECTED' }).subscribe({
            next: () => {
                this.toast.success('Solicitud rechazada');
                this.reload();
            },
            error: () => {},
        });
    }

    planTitle(plan: any): string {
        if (!plan?.title) return '';
        const t = plan.title;
        return t.es || t.en || '';
    }
}
