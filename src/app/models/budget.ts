export interface Service {
  name: string;
  label: string;
  description: string;
  price: number;
}

export interface BudgetInfo {
  name: string;
  phone: string;
  email: string;
}

export interface BudgetData {
  seo: boolean | null;
  ads: boolean | null;
  web: boolean | null;
  webPages: number | null;
  webLangs: number | null;
}

export interface Budget {
  budgetInfo: BudgetInfo;
  budgetData: BudgetData;
  totalCost: number;
  budgetDate: string;
}
