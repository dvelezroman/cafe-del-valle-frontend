import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import {
  PartnerProfileService,
  loyaltyTierFromPoints,
  partnerStatusLabel,
} from '../../../services/partner-profile.service';

@Component({
  selector: 'app-partner-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  readonly partnerProfile = inject(PartnerProfileService);
  referralPoints = 50;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    if (!this.partnerProfile.profile()) {
      this.partnerProfile.refresh();
    }
  }

  statusLabel(status: string | undefined): string {
    return partnerStatusLabel(status);
  }

  tierLabel(points: number | undefined, status: string | undefined): string {
    if (status !== 'APPROVED') return '—';
    return loyaltyTierFromPoints(points ?? 0).label;
  }

  statusPillClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'status-pill pending';
      case 'REJECTED':
        return 'status-pill rejected';
      case 'APPROVED':
        return 'status-pill approved';
      default:
        return 'status-pill neutral';
    }
  }

  copyCode() {
    const code = this.partnerProfile.profile()?.referralCode;
    if (code) {
      navigator.clipboard.writeText(code);
      this.toastService.success('Código copiado al portapapeles!');
    }
  }
}
