import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-category-summary-chart',
    templateUrl: './category-summary-chart.component.html',
    styleUrls: ['./category-summary-chart.component.scss']
})
export class CategorySummaryChartComponent implements OnInit, OnChanges
{
    @Input() data!: any[];
    @Input() date!: Date;
    @Input() categories!: string[];
    finalData: any = [];

    ngOnInit()
    {
       
    }


    ngOnChanges(changes: SimpleChanges)
    {
        this.setCategoriesData();
    }

    makePieChart()
    {
        Highcharts.chart('container2', {
          chart: {
            styledMode: false,
          },
          title: {
            text: 'Category Summary Chart',
            align: 'left',
          },
          xAxis: {
            categories: [],
          },

          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y}€',
              },
            },
          },
          series: [
            {
              type: 'pie',
              allowPointSelect: true,
              keys: ['name', 'y', 'selected', 'sliced'],
              data: this.finalData,
              showInLegend: true,
            },
          ],
        });

    }

    setCategoriesData()
    {
        this.finalData = [];
        
        let finalData = this.data.map((item: any) => ({
            series: [
                item.name, // Extract the year from the date
                Number(item.value)  // Convert the value to a number
            ]
        }));

        finalData.forEach((element: any) =>
        {
            this.finalData.push(element.series);
        });

        this.makePieChart();
    }

}
