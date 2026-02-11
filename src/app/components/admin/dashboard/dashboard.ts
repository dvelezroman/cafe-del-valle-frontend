import { Component, computed, signal, ViewChild, HostListener } from '@angular/core';
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
  @ViewChild(Sidebar) sidebar!: Sidebar;
  user = computed(() => this.authService.currentUser());
  sidebarOpen = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    // Keyboard shortcut: Alt+M to toggle sidebar
    if (event.altKey && event.key === 'm') {
      event.preventDefault();
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(val => !val);
    if (this.sidebar) {
      this.sidebar.toggle();
    }
  }

  logout() {
    this.authService.logout();
  }
}
