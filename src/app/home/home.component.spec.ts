import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { BudgetService } from '../services/budget.service';
import { Budget, Service } from '../models/budget';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let budgetServiceMock: jasmine.SpyObj<BudgetService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: ActivatedRoute;

  beforeEach(async () => {
    const budgetServiceSpy = jasmine.createSpyObj('BudgetService', ['getServices', 'calculateTotalCost', 'saveBudget', 'getBudgets']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      queryParams: of({})
    } as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HomeComponent],
      providers: [
        { provide: BudgetService, useValue: budgetServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    budgetServiceMock = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    budgetServiceMock.getServices.and.returnValue([{ name: 'seo', label: 'SEO', description: 'Search Engine Optimization', price: 200 }] as Service[]);
    budgetServiceMock.calculateTotalCost.and.returnValue(200);
    budgetServiceMock.getBudgets.and.returnValue([] as Budget[]);

    fixture.detectChanges();
  });

  it('should create the form with default values', () => {
    expect(component).toBeTruthy();
    expect(component.budgetForm).toBeTruthy();
    expect(component.budgetInfo).toBeTruthy();
    expect(component.budgetForm.controls['web']).toBeDefined();
    expect(component.budgetInfo.controls['name']).toBeDefined();
  });

  it('should mark name field as invalid if empty', () => {
    const nameControl = component.budgetInfo.controls['name'];
    nameControl.setValue('');
    expect(nameControl.invalid).toBeTruthy();
  });

  it('should enable submit button when form is valid and totalCost is greater than 0', () => {
    component.budgetInfo.controls['name'].setValue('John Doe');
    component.budgetInfo.controls['phone'].setValue('123456789');
    component.budgetInfo.controls['email'].setValue('john@example.com');
    component.totalCost = 100;

    fixture.detectChanges();

    const submitButton = el.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should show warning if totalCost is 0', () => {
    component.budgetInfo.controls['name'].setValue('John Doe');
    component.budgetInfo.controls['phone'].setValue('123456789');
    component.budgetInfo.controls['email'].setValue('john@example.com');
    component.totalCost = 0;

    fixture.detectChanges();

    const errorMessage = el.query(By.css('.alert-warning')).nativeElement;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Si us plau afageix un servei al pressupost.');
  });

  it('should calculate total cost on form value changes', () => {
    component.budgetForm.controls['seo'].setValue(true);
    expect(budgetServiceMock.calculateTotalCost).toHaveBeenCalled();
    expect(component.totalCost).toBe(200);
  });

  it('should save budget on requestBudget call', () => {
    component.budgetInfo.controls['name'].setValue('John Doe');
    component.budgetInfo.controls['phone'].setValue('123456789');
    component.budgetInfo.controls['email'].setValue('john@example.com');
    component.totalCost = 200;

    component.requestBudget();

    expect(budgetServiceMock.saveBudget).toHaveBeenCalled();
    expect(component.budgetForm.value.seo).toBe(false);
    expect(component.budgetInfo.value.name).toBe('');
  });

});
