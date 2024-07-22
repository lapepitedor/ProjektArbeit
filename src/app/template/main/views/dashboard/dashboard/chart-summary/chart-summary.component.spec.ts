import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSummaryComponent } from './chart-summary.component';

describe('ChartSummaryComponent', () => {
  let component: ChartSummaryComponent;
  let fixture: ComponentFixture<ChartSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartSummaryComponent]
    });
    fixture = TestBed.createComponent(ChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
