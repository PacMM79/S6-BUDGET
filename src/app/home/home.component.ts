import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelComponent } from '../panel/panel.component';
import { BudgetService } from '../services/budget.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { Budget, BudgetData, BudgetInfo, Service } from '../models/budget';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, WelcomeComponent, BudgetsListComponent, PanelComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  totalCost: number = 0;
  services!: Service[];
  savedBudgets: Budget[] = [];

  budgetForm = new FormGroup({
    seo: new FormControl(false),
    ads: new FormControl(false),
    web: new FormControl(false),
    webPages: new FormControl<number>(1),
    webLangs: new FormControl<number>(1),
  });

  budgetInfo = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  budgetService: BudgetService = inject(BudgetService);
  ngOnInit() {
    this.services = this.budgetService.getServices();
    this.budgetForm.valueChanges.subscribe((values) => {
      this.calculateCost(values as Partial<BudgetData>);
    });
  }
  calculateCost(values: Partial<BudgetData>) {
    this.totalCost = this.budgetService.calculateTotalCost(values);
  }

  requestBudget() {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    
    this.budgetService.saveBudget(
      this.budgetInfo.value as BudgetInfo,
      this.budgetForm.value as BudgetData,
      this.totalCost,
      formattedDate,
    );
    this.budgetForm.reset({
      seo: false,
      ads: false,
      web: false,
      webPages: 1,
      webLangs: 1,
    });
    this.budgetInfo.reset({
      name: '',
      phone: '',
      email: '',
    });
    this.savedBudgets = this.budgetService.getBudgets();
  }

  formatDate(date: Date): string {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}