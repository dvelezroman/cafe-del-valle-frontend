import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-partner-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  user: any = null;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
  }
}
