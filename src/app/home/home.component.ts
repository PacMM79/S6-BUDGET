import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { Budget, BudgetData, Service } from '../models/budget';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, WelcomeComponent, BudgetsListComponent ],
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

}