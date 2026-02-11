import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data';

@Component({
  selector: 'app-menu-management',
  imports: [CommonModule],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.scss'
})
export class MenuManagement implements OnInit {
  menuItems: any;

  constructor(private dataService: DataService) {
    this.menuItems = this.dataService.menuItems;
  }

  ngOnInit() {
    // Fetch fresh data from API
    this.dataService.fetchMenuItems().subscribe({
      error: (err) => {
        console.error('Error fetching menu items:', err);
      }
    });
  }
}
