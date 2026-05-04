import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerProfileService } from '../../../services/partner-profile.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  readonly partnerProfile = inject(PartnerProfileService);

  ngOnInit() {
    if (!this.partnerProfile.profile()) {
      this.partnerProfile.refresh();
    }
  }
}
