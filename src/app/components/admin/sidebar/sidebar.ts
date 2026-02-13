import { Component, signal, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements AfterViewInit {
  @ViewChild('sidebar') sidebarRef!: ElementRef<HTMLElement>;
  @ViewChild('firstLink') firstLinkRef!: ElementRef<HTMLAnchorElement>;
  isOpen = signal(false);

  ngAfterViewInit() {
    // Ensure sidebar is closed by default on mobile
    if (window.innerWidth < 768) {
      this.isOpen.set(false);
      this.setupFocusTrap();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const sidebar = this.sidebarRef?.nativeElement;
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Close sidebar if clicking outside on mobile
    if (window.innerWidth < 768 && 
        this.isOpen() && 
        sidebar && 
        !sidebar.contains(target) && 
        menuToggle && 
        !menuToggle.contains(target)) {
      this.close();
    }
  }

  @HostListener('window:resize')
  handleResize() {
    // Auto-close sidebar on resize to desktop if it was open
    if (window.innerWidth >= 768) {
      this.isOpen.set(false);
      document.body.style.overflow = '';
    } else {
      // Ensure sidebar is closed by default on mobile
      if (window.innerWidth < 768) {
        this.isOpen.set(false);
        document.body.style.overflow = '';
      }
      this.setupFocusTrap();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    // Close sidebar on Escape key
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
      // Return focus to menu toggle
      const menuToggle = document.querySelector('.menu-toggle') as HTMLElement;
      if (menuToggle) {
        menuToggle.focus();
      }
    }
  }

  toggle() {
    this.isOpen.update(val => !val);
    this.updateBodyScroll();
    
    // Focus management
    if (this.isOpen() && window.innerWidth < 768) {
      setTimeout(() => {
        const firstLink = this.firstLinkRef?.nativeElement;
        if (firstLink) {
          firstLink.focus();
        }
      }, 100);
    }
  }

  close() {
    this.isOpen.set(false);
    this.updateBodyScroll();
    // Return focus to menu toggle on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const menuToggle = document.querySelector('.menu-toggle') as HTMLElement;
        if (menuToggle) {
          menuToggle.focus();
        }
      }, 100);
    }
  }

  private updateBodyScroll() {
    if (window.innerWidth < 768) {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    }
  }

  private setupFocusTrap() {
    // Focus trap implementation would go here
    // For now, we rely on Escape key and click outside
  }
}
