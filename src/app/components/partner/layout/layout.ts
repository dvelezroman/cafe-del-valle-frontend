import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PartnerProfileService } from '../../../services/partner-profile.service';

@Component({
  selector: 'app-partner-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  private authService = inject(AuthService);
  readonly partnerProfile = inject(PartnerProfileService);

  user: any = null;

  constructor() {
    this.user = this.authService.currentUser();
  }

  ngOnInit(): void {
    this.partnerProfile.refresh();
  }

  badgeClasses(): Record<string, boolean> {
    const b = this.partnerProfile.headerBadge();
    return {
      'role-badge--pending': b.variant === 'pending',
      'role-badge--rejected': b.variant === 'rejected',
      'role-badge--tier': b.variant === 'tier',
      [`role-badge--tier-${b.tierKey}`]: b.variant === 'tier' && !!b.tierKey,
    };
  }

  logout() {
    this.authService.logout();
  }
}
