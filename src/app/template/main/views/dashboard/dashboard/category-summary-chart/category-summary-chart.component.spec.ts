import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySummaryChartComponent } from './category-summary-chart.component';

describe('CategorySummaryChartComponent', () => {
  let component: CategorySummaryChartComponent;
  let fixture: ComponentFixture<CategorySummaryChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorySummaryChartComponent]
    });
    fixture = TestBed.createComponent(CategorySummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
