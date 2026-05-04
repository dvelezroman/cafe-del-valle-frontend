import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type PartnerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const TIER_THRESHOLDS = [
  { min: 500, key: 'platinum', label: 'Platino' },
  { min: 200, key: 'gold', label: 'Oro' },
  { min: 50, key: 'silver', label: 'Plata' },
  { min: 0, key: 'bronze', label: 'Bronce' },
] as const;

/** Loyalty display tier for approved partners (derived from points). */
export function loyaltyTierFromPoints(points: number): { key: string; label: string } {
  const p = Math.max(0, points || 0);
  for (const t of TIER_THRESHOLDS) {
    if (p >= t.min) return { key: t.key, label: t.label };
  }
  return { key: 'bronze', label: 'Bronce' };
}

export function partnerStatusLabel(status: string | undefined): string {
  switch (status) {
    case 'PENDING':
      return 'Pendiente de aprobación';
    case 'APPROVED':
      return 'Activo';
    case 'REJECTED':
      return 'No aprobado';
    default:
      return '—';
  }
}

@Injectable({ providedIn: 'root' })
export class PartnerProfileService {
  private http = inject(HttpClient);

  readonly profile = signal<any>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  /** Badge shown in partner shell header: status or loyalty tier. */
  readonly headerBadge = computed(() => {
    const p = this.profile();
    if (!p) return { text: '', tierKey: '', variant: 'loading' as const };
    const status = p.status as PartnerStatus | undefined;
    if (status === 'PENDING') {
      return { text: 'Pendiente', tierKey: '', variant: 'pending' as const };
    }
    if (status === 'REJECTED') {
      return { text: 'No aprobado', tierKey: '', variant: 'rejected' as const };
    }
    if (status === 'APPROVED') {
      const tier = loyaltyTierFromPoints(p.points);
      return { text: `Socio ${tier.label}`, tierKey: tier.key, variant: 'tier' as const };
    }
    return { text: partnerStatusLabel(status), tierKey: '', variant: 'neutral' as const };
  });

  refresh(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.http.get<any>(`${environment.apiUrl}/partner/profile`).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }
}
