import { Injectable } from '@angular/core';
import { Budget, BudgetInfo, BudgetData, Service } from '../models/budget';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {
  services = [
    { name: 'seo', label: 'SEO', description: 'Millora els resultats de la teva web als buscadors.', price: 300 },
    { name: 'ads', label: 'Ads', description: 'Inclou anuncis a la teva web per generar ingressos.', price: 400 },
    { name: 'web', label: 'Web', description: 'Programació d\'una web responsive completa.', price: 500 },
  ];

  savedBudgets: Budget[] = [];

  constructor() {}

  getServices(): Service[] {
    return this.services;
  }

  calculateTotalCost(formValues: Partial<BudgetData>): number {
    let totalCost = 0;

    totalCost = this.services.reduce((acc: number, service: Service) => {
      return acc + (formValues[service.name as keyof BudgetData] ? service.price : 0);
    }, 0);

    if (formValues.web) {
      const webPages = formValues.webPages ?? 1;
      const webLangs = formValues.webLangs ?? 1;
      const addWebPages = (webPages - 1) * 30;
      const addWebLangs = (webLangs - 1) * 30;
      totalCost += addWebLangs + addWebPages;
    }
    return totalCost;
  }

  saveBudget(budgetInfo: BudgetInfo, budgetData: BudgetData, totalCost: number, budgetDate: string) {
    const budget: Budget = { budgetInfo, budgetData, totalCost, budgetDate };
    this.savedBudgets.push(budget);
  }

  getBudgets() {
    return this.savedBudgets;
  }
}
