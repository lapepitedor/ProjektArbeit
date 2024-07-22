import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);

import { Expense } from 'src/app/core/models/expense-model';

@Component({
    selector: 'app-monthly-summary-chart',
    templateUrl: './monthly-summary-chart.component.html',
    styleUrls: ['./monthly-summary-chart.component.scss']
})
export class MonthlySummaryChartComponent implements OnInit, OnChanges
{
    @Input() data!: Expense[];
    @Input() date!: Date;
    @Input() categories: string[] = [];
    currentData!: Expense[];
    originalData: any[] = [];
  
    chart: any;

    chartData: any = [
        {
            name: 'Income',
            data: []
        },
        {
            name: 'Expense',
            data: []
        }
    ];

    ngOnInit()
    {
        
    }

    ngOnChanges(changes: SimpleChanges)
    {
        this.chartData[0].data = [];
        this.chartData[1].data = [];

        this.categories?.forEach(element =>
        {
            this.chartData[0].data.push(0);
            this.chartData[1].data.push(0);
        });

        this.categories?.forEach((cat, index) =>
        {
            this.data.forEach(element =>
            {
                if (element.category === cat)
                {
                    if (element.expense_type == 'Income')
                    {
                       
                        if (index != -1)
                        {
                            this.chartData[0].data[index] += element.amount;
                        }
                        else
                        {
                            this.chartData[0].data[index] += 0;
                        }

                    }

                    if (element.expense_type == 'Expense')
                    {
                    
                        if (index != -1)
                        {
                            this.chartData[1].data[index] += element.amount;
                        }
                        else
                        {
                            this.chartData[1].data[index] += 0;
                        }
                    }
                }
            });
        });


        this.makeHighChart();
    }


    onSelect(event: any)
    {
        console.log(event);
    }

    makeHighChart()
    {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Income vs Expense Chart',
                align: 'left'
            },
          
            xAxis: {
                categories: this.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Euro'
                }
            },
            tooltip: {
                valueSuffix: '€'
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: this.chartData
        });
    }
}
