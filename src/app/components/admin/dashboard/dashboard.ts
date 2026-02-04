import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  user = computed(() => this.authService.currentUser());

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
  }
}
