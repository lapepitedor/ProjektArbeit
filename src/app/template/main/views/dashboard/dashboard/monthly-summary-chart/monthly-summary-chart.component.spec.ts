import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySummaryChartComponent } from './monthly-summary-chart.component';

describe('MonthlySummaryChartComponent', () => {
  let component: MonthlySummaryChartComponent;
  let fixture: ComponentFixture<MonthlySummaryChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySummaryChartComponent]
    });
    fixture = TestBed.createComponent(MonthlySummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
