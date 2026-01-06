import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { CoffeeVariety } from '../../services/data';

@Component({
  selector: 'app-coffee',
  imports: [],
  templateUrl: './coffee.html',
  styleUrl: './coffee.scss'
})
export class Coffee {
  constructor(public dataService: DataService) {}
  
  get coffeeVarieties(): CoffeeVariety[] {
    return this.dataService.getCoffeeVarieties();
  }
}
