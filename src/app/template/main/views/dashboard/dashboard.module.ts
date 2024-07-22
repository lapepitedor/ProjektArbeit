import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategorySummaryChartComponent } from './dashboard/category-summary-chart/category-summary-chart.component';
import { ChartSummaryComponent } from './dashboard/chart-summary/chart-summary.component';
import { MonthlySummaryChartComponent } from './dashboard/monthly-summary-chart/monthly-summary-chart.component';
import { NumberCardsComponent } from './dashboard/number-cards/number-cards.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChartModule } from 'angular2-highcharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    CategorySummaryChartComponent,
    ChartSummaryComponent,
    MonthlySummaryChartComponent,
    NumberCardsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
   
    NgxChartsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: []
})
export class DashboardModule { }
