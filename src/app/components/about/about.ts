import { Component } from '@angular/core';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  constructor(public dataService: DataService) {}
  
  get cafeInfo() {
    return this.dataService.getCafeInfo();
  }
}
