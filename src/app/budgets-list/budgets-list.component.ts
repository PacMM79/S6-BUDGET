import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelComponent } from '../panel/panel.component';
import { BudgetService } from '../services/budget.service';
import { Budget, Service } from '../models/budget';

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, PanelComponent ],
  templateUrl: './budgets-list.component.html',
  styleUrl: './budgets-list.component.scss'
})

export class BudgetsListComponent {
  budgetService: BudgetService = inject(BudgetService);

  savedBudgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  services: Service[] = [];
  isPriceAscending: boolean = true;
  isNameAscending: boolean = true;
  isDateAscending: boolean = true;

  ngOnInit() {
    this.savedBudgets = this.budgetService.getBudgets();
    this.filteredBudgets = this.savedBudgets;
    this.services = this.budgetService.getServices();
  }

  orderByName() {
    if (this.isNameAscending) {
      this.savedBudgets.sort((a, b) =>
        a.budgetInfo.name.localeCompare(b.budgetInfo.name)
      );
    } else {
      this.savedBudgets.sort((a, b) =>
        b.budgetInfo.name.localeCompare(a.budgetInfo.name)
      );
    }
    this.isNameAscending = !this.isNameAscending;
  }

  orderByPrice() {
    if (this.isPriceAscending) {
      this.savedBudgets.sort((a, b) => a.totalCost - b.totalCost);
    } else {
      this.savedBudgets.sort((a, b) => b.totalCost - a.totalCost);
    }
    this.isPriceAscending = !this.isPriceAscending;
  }

  orderByDate() {
    if (this.isDateAscending) {
      this.savedBudgets.sort((a, b) => new Date(a.budgetDate).getTime() - new Date(b.budgetDate).getTime());
    } else {
      this.savedBudgets.sort((a, b) => new Date(b.budgetDate).getTime() - new Date(a.budgetDate).getTime());
    }
    this.isDateAscending = !this.isDateAscending;
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredBudgets = this.savedBudgets;
      return;
    }

    this.filteredBudgets = this.savedBudgets.filter((budget) =>
      budget?.budgetInfo.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  constructor() {}
  
}
