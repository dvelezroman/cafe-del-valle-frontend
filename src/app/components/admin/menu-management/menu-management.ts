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
  menuItems: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.menuItems = this.dataService.getMenuItems();
  }
}
